# EXIF Data Stripping Implementation

**Date**: 2026-03-20
**Purpose**: Security & Privacy - Remove sensitive metadata from uploaded images

## Overview

Implemented automatic EXIF metadata stripping for all uploaded images to protect user privacy. This removes sensitive data such as GPS coordinates, device information, timestamps, and other metadata that could compromise user location or device security.

## Changes Made

### 1. Added Sharp Dependency
**File**: `backend/package.json`

Added `sharp` (^0.33.0) to dependencies. Sharp is the industry-standard Node.js image processing library, used for:
- EXIF/IPTC/XMP metadata removal
- Supporting JPEG, PNG, and WebP formats
- High performance with native bindings

### 2. Created EXIF Stripper Utility
**File**: `backend/src/modules/uploads/exif-stripper.ts`

New utility module with two exported functions:

#### `stripExifMetadata(imageBuffer, mimeType)`
- Removes all EXIF/IPTC/XMP metadata from images
- Supports: JPEG, PNG, WebP
- Non-image types return unchanged buffer
- Error handling: If stripping fails, returns original buffer (upload continues)
- Logs file size reduction for debugging

#### `isExifStrippableImage(mimeType)`
- Quick check to determine if a MIME type needs stripping
- Used by other services for conditional logic

**Supported formats**: image/jpeg, image/png, image/webp

### 3. Enhanced S3Service
**File**: `backend/src/modules/uploads/s3.service.ts`

Added new method: `stripExifAndReupload(key, mimeType)`

**Process**:
1. Downloads image from S3
2. Calls `stripExifMetadata()` to remove all metadata
3. Re-uploads cleaned image to same S3 location (replaces original)
4. Error handling: Logs warning but does NOT block upload if stripping fails

**Key design decision**: Runs asynchronously in background (fire-and-forget) to avoid blocking the upload confirmation response.

### 4. Integrated with Upload Confirmation Flow
**File**: `backend/src/modules/uploads/uploads.service.ts`

Modified `confirmUpload()` method:

```typescript
if (fileAsset.mimeType.startsWith('image/')) {
  this.s3Service
    .stripExifAndReupload(fileAsset.storageKey, fileAsset.mimeType)
    .catch((error) => {
      this.logger.warn(`EXIF stripping background task échoué...`);
    });
}
```

**Behavior**:
- Triggers automatically for all image uploads
- Non-blocking (async background task)
- Magic bytes validation still happens first
- Status updated to CONFIRMED immediately (doesn't wait for stripping)
- Errors logged but not propagated (upload still succeeds)

### 5. Added Unit Tests
**File**: `backend/src/modules/uploads/exif-stripper.spec.ts`

Test coverage for:
- Image type detection (JPEG, PNG, WebP, PDF, video)
- Error handling for non-image types
- Graceful failure for corrupted/invalid buffers

## Upload Flow (Updated)

```
Client Upload
    ↓
1. generatePresignedUploadUrl() — Client uploads directly to S3 via presigned URL
    ↓
2. confirmUpload() called by client
    ↓
3. Magic bytes validation (existing)
    ↓
4. EXIF stripping (NEW) — async background task
    ├─ Download from S3
    ├─ Strip metadata with Sharp
    ├─ Re-upload cleaned file
    └─ Log success/failure (non-blocking)
    ↓
5. Status updated to CONFIRMED
    ↓
6. Response sent to client (doesn't wait for EXIF stripping)
```

## Data Privacy Protected

The implementation removes the following sensitive metadata:

- **GPS Coordinates**: Exact location of photo capture
- **Timestamps**: Date/time photo was taken
- **Device Information**: Camera/phone model and manufacturer
- **Software Info**: Apps, filters, or editing tools used
- **IPTC Keywords**: Tags, descriptions, copyright info
- **XMP Data**: Author, history, editing metadata
- **Thumbnail Data**: Can contain GPS from cropped versions

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Sharp not available | Falls back gracefully, returns original buffer |
| Invalid image format | Error logged, original uploaded unchanged |
| S3 download fails | Warning logged, original kept with metadata |
| S3 re-upload fails | Warning logged, original kept with metadata |
| Magic bytes fails first | Upload rejected (existing validation) |
| EXIF stripping fails | Upload still succeeds with metadata intact |

**Philosophy**: Never block user uploads due to privacy enhancements. Transparency and logging instead.

## Performance Implications

- **Upload confirmation**: No latency impact (async background task)
- **S3 bandwidth**: Double bandwidth for image files (download + re-upload)
- **Compute**: Sharp is native C++ binding, very fast (~1-5ms per image typically)
- **Recommendation**: Monitor CloudWatch metrics if high volume of image uploads

## Logging

All EXIF stripping operations logged at INFO/WARNING level:

```
[NestJS INFO] EXIF stripping complété et re-upload pour uploads/user123/1234567890-abc12345.jpg
[NestJS DEBUG] EXIF stripping réussi: 2540000 → 2480000 bytes (image/jpeg)
[NestJS WARN] EXIF stripping échoué pour image/png: Buffer is too small...
```

## Testing

To test EXIF stripping:

```bash
# Install dependencies
cd backend && npm install

# Run unit tests
npm run test -- exif-stripper.spec.ts

# Check logs during upload confirmation
npm run start:dev
# Monitor logs for "EXIF stripping" messages
```

## Future Enhancements

1. **Image re-encoding options**: Compress images during EXIF stripping
2. **Metadata whitelist**: Allow preserving non-sensitive metadata
3. **Format conversion**: Convert to WebP for better compression
4. **Caching**: Cache stripped images separately if original needed
5. **Metrics**: Track EXIF stripping success rate via monitoring

## References

- Sharp documentation: https://sharp.pixelplumbing.com/
- EXIF spec: https://en.wikipedia.org/wiki/Exif
- Privacy best practices: OWASP, GDPR compliance
