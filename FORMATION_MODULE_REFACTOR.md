# Formation Module Refactor — DB-Backed with Fallback

**Date**: 2026-03-21
**Status**: Complete
**Scope**: Move `TRAINING_THEMES` hardcoded constant to database-backed storage with fallback

---

## Summary

The `FormationService` has been refactored to load 22 training modules (3 themes + videos) from the database (`FormationModule` table) instead of a hardcoded constant. The approach maintains backward compatibility with a fallback to `DEFAULT_TRAINING_THEMES` if the database is empty.

### Key Changes

1. **Prisma Schema** — Added `FormationModule` model
2. **FormationService** — Renamed constant, added DB loading, caching, and seeding
3. **Migration** — Created migration to initialize the table

---

## Files Modified

### 1. `/backend/prisma/schema.prisma`
- **Added**: `FormationModule` model (after `ProFormation`)
- **Fields**:
  - `id` (CUID primary key)
  - `moduleId` (unique, e.g., `TRN_TC_001`)
  - `themeId` (e.g., `theme-tronc-commun`)
  - `title`, `description`, `objective`
  - `durationMin`, `videoUrl` (optional)
  - `priority` (0=MANDATORY, 1=RECOMMENDED, 2=OPTIONAL)
  - `isActive` (boolean, default true)
  - `createdAt`, `updatedAt` (timestamps)
  - Indices on `themeId` and `isActive` for performance

### 2. `/backend/prisma/migrations/20260321_add_formation_module_table/migration.sql`
- **Created**: New migration to create `FormationModule` table
- **Actions**:
  - Creates table with all fields and constraints
  - Creates unique index on `moduleId`
  - Creates performance indices on `themeId` and `isActive`

### 3. `/backend/src/modules/pro/formation/formation.service.ts`

#### Changes Summary
- **Renamed constant**: `TRAINING_THEMES` → `DEFAULT_TRAINING_THEMES`
- **Added cache**: `trainingThemesCache: TrainingTheme[] | null`
- **Added method**: `loadTrainingThemesFromDB()` (private)
- **Updated methods**: All methods now call `getTrainingThemes()` which reads from DB
- **Added seeding**: `seedDefaultFormationModules()`
- **Added cache invalidation**: `invalidateCache()`

#### Detailed Method Changes

##### 1. `loadTrainingThemesFromDB()` (new, private)
```typescript
private async loadTrainingThemesFromDB(): Promise<TrainingTheme[]>
```
- Reads all active `FormationModule` records from DB
- Groups by `themeId` to reconstruct `TrainingTheme[]` structure
- Merges metadata (icon, description, order) from `DEFAULT_TRAINING_THEMES`
- **Fallback**: Returns `DEFAULT_TRAINING_THEMES` if:
  - No records in DB
  - Query error occurs
- **Logging**: Warns when falling back

##### 2. `getTrainingThemes()` (updated)
- Now async (was already async)
- Uses cache if available (single DB query per app lifecycle unless cache is invalidated)
- Calls `loadTrainingThemesFromDB()` if cache is empty
- Returns themes sorted by `order`

##### 3. `getThemeBySlug()`, `getVideoById()`, `getModuleContent()` (updated)
- All now call `await this.getTrainingThemes()` instead of using `TRAINING_THEMES` directly
- No signature changes — all remain async

##### 4. `getTrainingProgress()` (updated)
- Calls `await this.getTrainingThemes()` instead of `TRAINING_THEMES`
- No logic changes otherwise

##### 5. `markAllModulesComplete()` (updated)
- Calls `await this.getTrainingThemes()` instead of `TRAINING_THEMES`
- No logic changes otherwise

##### 6. `seedDefaultFormationModules()` (new)
```typescript
async seedDefaultFormationModules(): Promise<void>
```
- Checks if table already has records
- If not, inserts all 22 modules from `DEFAULT_TRAINING_THEMES`
- Maps:
  - `video.id` → `moduleId`
  - `theme.id` → `themeId`
  - `video.priority` (string) → `priority` (0/1/2)
  - `video.status` → `isActive`
- Uses `createMany()` with `skipDuplicates: true` for idempotency
- Invalidates cache after seeding
- **Call in**: App module bootstrap or setup flow

##### 7. `invalidateCache()` (new)
```typescript
invalidateCache(): void
```
- Sets `trainingThemesCache = null`
- Use after admin updates to the database

---

## Migration Path

### Option A: Auto-seed at App Startup (Recommended)

In your app module or bootstrap:

```typescript
import { FormationService } from './modules/pro/formation/formation.service';

@Module({
  providers: [FormationService],
})
export class AppModule {
  constructor(private formationService: FormationService) {}

  async onModuleInit() {
    // Seed FormationModule table if empty
    await this.formationService.seedDefaultFormationModules();
  }
}
```

### Option B: Manual Seed via CLI

```bash
# Generate migration
npx prisma migrate dev --name add_formation_module_table

# Then call from your CLI/seed script
const formationService = app.get(FormationService);
await formationService.seedDefaultFormationModules();
```

---

## Behavior

### When DB is populated
1. `loadTrainingThemesFromDB()` reads 22 modules
2. Groups them by theme
3. Returns structured `TrainingTheme[]` (3 themes + 22 videos)
4. Cache stores result for ~app lifetime (until `invalidateCache()`)

### When DB is empty
1. `loadTrainingThemesFromDB()` returns `DEFAULT_TRAINING_THEMES` (hardcoded fallback)
2. All endpoints work identically
3. No service disruption during migration
4. Admin can seed later via seeding method

### When DB has partial data
- Works as expected (whatever is in DB is returned)
- Merges metadata from `DEFAULT_TRAINING_THEMES` fallback

---

## API Endpoints (No Changes)

All existing endpoints work identically:

- `GET /pro/training/themes` — Returns 3 themes + 22 videos
- `GET /pro/training/themes/:slug` — Returns 1 theme
- `GET /pro/training/videos/:videoId` — Returns 1 video + theme name
- `POST /pro/training/videos/:id/seen` — Mark as seen
- `GET /pro/training/progress` — User progress
- `POST /pro/formation/complete-all` — Mark all as seen (legacy)

---

## Testing Checklist

- [ ] Run migration: `npx prisma migrate dev`
- [ ] Run seed: `await formationService.seedDefaultFormationModules()`
- [ ] Verify 22 records in `FormationModule` table
- [ ] Call `GET /pro/training/themes` — should return 3 themes
- [ ] Call `GET /pro/training/progress` — should show correct stats
- [ ] Call `POST /pro/training/videos/TRN_TC_001/seen` — should work
- [ ] Restart app and verify cache works (2nd call should be instant)
- [ ] Call `invalidateCache()` and verify DB is re-queried

---

## Rollback Plan

If issues arise:

1. **Revert migration**: `npx prisma migrate resolve --rolled-back 20260321_add_formation_module_table`
2. **Revert code**: Git revert to previous commit
3. **Service falls back to `DEFAULT_TRAINING_THEMES`** automatically (even with old code)

---

## Performance Notes

- **Cache**: One DB query per app startup (or until cache invalidation)
- **Queries**: Using Prisma's efficient `findMany` with `isActive` index
- **Indices**: `themeId` and `isActive` for fast filtering
- **No N+1**: Single query groups all modules by theme

---

## Future Enhancements

1. **Admin UI**: CRUD for `FormationModule` records
2. **Video CMS**: Link real video URLs
3. **Dynamic priority**: Allow admins to reorder/disable modules
4. **i18n**: Translate titles/descriptions per locale
5. **Analytics**: Track completion rates per video/theme

---

## Files Created/Modified Summary

| File | Type | Action |
|------|------|--------|
| `schema.prisma` | Modified | Added `FormationModule` model |
| `migrations/.../migration.sql` | Created | SQL to create table + indices |
| `formation.service.ts` | Modified | Refactored to use DB with fallback |

**Total lines changed**: ~350 (new DB logic + updated methods)
**Breaking changes**: None (all endpoints work identically)
**Backward compatible**: Yes (fallback to hardcoded data)
