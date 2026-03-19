# SPRINT 6 — Page Détail : Waitlist, FAQ, Avis, Compteur, Partage, QR

> **Durée estimée** : 1h30
> **Scope** : Page détail `/voyages/[slug]` — fonctionnalités sociales et engagement
> **Pré-requis** : Sprint 5 terminé

## Contexte (draw.io manquants)

- **Item 17** : Formulaire "Être notifié" (PREANNOUNCE) — email, tél, ville, RGPD
- **Item 18** : Waitlist 24h quand complet
- **Item 19** : FAQ section
- **Item 20** : Section avis/témoignages
- **Item 22** : Voyages similaires / carrousel recommandations
- **Item 25** : QR code partageable téléchargeable
- **Item 26** : Compteur "X intéressés" (pageViews + leads)

## Fichiers à créer

### 1. `frontend/components/travel-detail/PreannounceForm.tsx` (NOUVEAU)

Formulaire "Être notifié" pour voyages en statut PREANNOUNCE :

```
Fonctionnalités :
- Champs : email (requis), téléphone (optionnel), ville de départ (optionnel)
- Checkbox RGPD avec lien vers politique de confidentialité
- Validation Zod côté client
- Envoi vers POST /travels/:id/preannounce
- État success avec animation confetti ou checkmark
- Conditionnel : affiché UNIQUEMENT si travel.status === 'PREANNOUNCE'
- Quand status === 'BOOKABLE', masqué au profit du bouton réservation
```

### 2. `frontend/components/travel-detail/WaitlistBanner.tsx` (NOUVEAU)

Bandeau waitlist quand voyage complet :

```
Fonctionnalités :
- Affiché si travel.currentBookings >= travel.capacity
- Message : "Ce voyage est complet ! Inscrivez-vous en liste d'attente — en cas de désistement, vous serez notifié dans les 24h."
- Formulaire intégré (email + téléphone)
- POST /travels/:id/waitlist
- Badge "⏳ Liste d'attente" orange
```

### 3. `frontend/components/travel-detail/TravelFAQ.tsx` (NOUVEAU)

Section FAQ avec accordéon :

```
Fonctionnalités :
- Données depuis travel.faqJson (parsé) ou FAQ par défaut
- Accordéon animé (hauteur auto)
- FAQ par défaut si aucune FAQ custom :
  - "Comment se déroule le ramassage ?"
  - "Que comprend le Pack Sérénité ?"
  - "Puis-je annuler ma réservation ?"
  - "Comment fonctionne le paiement en 3x ?"
  - "Les repas sont-ils inclus ?"
  - "Dois-je prendre une assurance voyage ?"
- Schema.org FAQPage pour le SEO
```

### 4. `frontend/components/travel-detail/TravelReviews.tsx` (NOUVEAU)

Section avis clients :

```
Fonctionnalités :
- Charge les avis depuis GET /travels/:id/reviews
- Note moyenne avec étoiles (1-5)
- Nombre total d'avis
- Barre de distribution (5★, 4★, 3★, 2★, 1★)
- Liste des avis : avatar, nom, date, note, commentaire
- Pagination (5 avis par page)
- Tri : plus récents, meilleure note, moins bonne note
- Fallback si aucun avis : "Soyez le premier à laisser un avis après votre voyage !"
```

### 5. `frontend/components/travel-detail/SimilarTravels.tsx` (NOUVEAU)

Carrousel voyages similaires :

```
Fonctionnalités :
- Charge depuis GET /travels/:id/similar?limit=4
- Carrousel horizontal avec TravelCard compact
- Titre : "Vous pourriez aussi aimer"
- Même style que ThematicSection du Sprint 3
```

### 6. `frontend/components/travel-detail/TravelShareQR.tsx` (NOUVEAU)

QR code + boutons partage :

```
Fonctionnalités :
- QR code généré côté client (library qrcode ou canvas)
- Bouton "Télécharger le QR" (PNG)
- Boutons partage individuels : WhatsApp, Facebook, Twitter/X, Email, Copier le lien
- Chaque bouton avec l'icône du réseau social
- Texte pré-rempli : "Je te recommande ce voyage : {title} — {url}"
```

### 7. `frontend/components/travel-detail/InterestCounter.tsx` (NOUVEAU)

Compteur "X personnes intéressées" :

```
Fonctionnalités :
- Affiche le nombre de vues + leads (préannonces + waitlist)
- Animation compteur au reveal
- Icône yeux + personnes
- Texte : "42 personnes s'intéressent à ce voyage" ou "127 vues cette semaine"
- Données depuis travel metadata
```

### 8. Modifier `voyage-detail-client.tsx`

Intégrer les composants dans la page existante :

```
Ordre d'insertion dans le JSX :
1. InterestCounter → Dans le hero, sous le prix
2. PreannounceForm OU WaitlistBanner → Conditionnel selon status/remplissage
3. TravelReviews → Après la section équipe
4. TravelFAQ → Après les avis
5. SimilarTravels → Avant le newsletter CTA
6. TravelShareQR → Dans la sidebar sticky (sous le bouton réserver)
```

### 9. Backend : Endpoints manquants

#### `POST /travels/:id/preannounce`

```typescript
// DTO
class CreatePreannounceDto {
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() city?: string;
  @IsBoolean() rgpdConsent: boolean;
}
```

#### `POST /travels/:id/waitlist`

```typescript
class CreateWaitlistDto {
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
}
```

#### `GET /travels/:id/similar`

Retourne les voyages avec même thème/région ou destination proche.

#### `GET /travels/:id/reviews`

Retourne les avis paginés avec note moyenne.

## Vérification

1. `npx tsc --noEmit` (front + back)
2. Formulaire préannonce visible sur un voyage PREANNOUNCE, masqué sur BOOKABLE
3. Waitlist visible quand voyage complet
4. FAQ accordéon s'ouvre/ferme avec animation
5. Avis affichent la distribution des notes
6. QR code se génère et se télécharge
7. Boutons partage ouvrent les bonnes URLs

---

## ⚠️ CORRECTIFS AUDIT V2 (2026-03-18) — À INTÉGRER

### C1. Avis = Témoignages MANUELS (pas UGC)
**IMPORTANT** : En MVP, les avis ne sont PAS du user-generated content. Ce sont des témoignages saisis par l'admin et modérés. Renommer et modifier :

- Renommer `TravelReviews.tsx` → `TravelTestimonials.tsx`
- Props : `enableTestimonials` (boolean) + `testimonials` (array depuis travel.testimonials JSON)
- Pas de fetch API reviews — données directement dans le travel
- Affichage conditionnel : SI `enableTestimonials === true` ET `testimonials.length > 0`
- Max 1-3 témoignages (author + text + date)
- Pas de note étoilée / pas de distribution — juste texte + auteur + date
- Fallback : rien (pas de "Soyez le premier")

### C2. Ajouter CTA "Être rappelé" (NOUVEAU composant)
Créer `frontend/components/travel-detail/CallbackForm.tsx` :

```
Fonctionnalités :
- Champs : email (requis), téléphone (optionnel), ville départ (optionnel)
- Consentement RGPD (checkbox requis)
- POST /travels/:id/callback-request
- Routage : notifie le Pro + contactInde si tripId présent
- Affiché dans : section équipe + sidebar sticky
- Bouton label : "Être rappelé"
```

### C3. Ajouter CTA "Recevoir le programme" (NOUVEAU composant)
Créer `frontend/components/travel-detail/ProgramRequestButton.tsx` :

```
Fonctionnalités :
- Bouton secondaire "Recevoir le programme par email"
- Clic → modal avec champ email
- POST /travels/:id/program-request
- Envoi email auto avec lien programme PDF
- Affiché dans : hero, sous le CTA principal
```

### C4. Ajouter bouton "Suivre l'indépendant" (NOUVEAU composant)
Créer `frontend/components/travel-detail/FollowCreatorButton.tsx` :

```
Fonctionnalités :
- Bouton "Suivre" (toggle) sur la section accompagnateur
- POST /api/client/follow/:proProfileId
- DELETE /api/client/follow/:proProfileId
- Notification opt-in : nouveau voyage publié (max 1 email/sem)
- Lien désinscription obligatoire
- Affiché dans : section "Votre accompagnateur"
```

### C5. Anti-doublon préannonce
Dans le endpoint `POST /travels/:id/preannounce`, vérifier :

```typescript
// Vérifier doublon avant insertion
const existing = await this.prisma.preReservation.findFirst({
  where: { travelId, email: dto.email },
});
if (existing) {
  throw new ConflictException('Vous êtes déjà inscrit pour ce voyage');
}
```

### C6. Bouton "Partager le voyage" après inscription préannonce
Dans `PreannounceForm.tsx`, après le success :

```tsx
{submitted && (
  <div className="text-center space-y-3">
    <p className="text-emerald-600 font-medium">✅ Vous serez notifié dès l'ouverture !</p>
    <button onClick={() => navigator.share?.({ title: travel.title, url: window.location.href })}
      className="px-4 py-2 bg-[#C75B39] text-white rounded-lg text-sm">
      Partager ce voyage
    </button>
  </div>
)}
```

### C7. Intégration des nouveaux composants dans voyage-detail-client.tsx

```
Ordre d'insertion mis à jour :
1. InterestCounter → Dans le hero, sous le prix
2. CTA "Recevoir le programme" → Sous le bouton Réserver (hero)
3. PreannounceForm OU WaitlistBanner → Conditionnel status/remplissage
4. FollowCreatorButton → Section accompagnateur
5. CallbackForm → Section équipe + sidebar
6. TravelTestimonials → Après section équipe (si enableTestimonials)
7. TravelFAQ → Après témoignages
8. SimilarTravels → Avant footer
9. TravelShareQR → Sidebar sticky
```

---

## Post-sprint

Mettre à jour `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` :
- Items 17, 18, 19, 20, 22, 25, 26 → ✅ Implémenté (Sprint 6)
- CTA "Être rappelé" → ✅
- CTA "Recevoir le programme" → ✅
- Suivre l'indépendant → ✅
- Témoignages manuels (correctif UGC) → ✅
- Anti-doublon préannonce → ✅
