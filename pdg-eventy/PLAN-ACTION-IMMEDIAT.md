# PLAN D'ACTION IMMÉDIAT — Semaine du 20 mars 2026

> **Objectif** : Débloquer le chemin critique. Le produit tech est PRÊT — c'est David qui doit agir.
> **Créé** : 20 mars 2026

---

## AUJOURD'HUI (vendredi 20 mars)

### 1. Envoyer les 6 brouillons Gmail — 10 minutes
Les 6 emails sont en brouillon depuis le 5 mars (15 jours). Il suffit de cliquer "Envoyer" sur chacun :

| # | Destinataire | Objet | Action |
|---|-------------|-------|--------|
| 1 | APST (info@apst.travel) | Adhésion + garantie financière | **Envoyer** |
| 2 | CMB Assurances | Devis RC Pro | **Envoyer** |
| 3 | Hiscox | Devis RC Pro | **Envoyer** |
| 4 | Chevalier Conseil | Devis expert-comptable | **Envoyer** |
| 5 | Nexco | Devis expert-comptable | **Envoyer** |
| 6 | Mutuaide | Devis assurance voyage groupes | **Envoyer** |

> Si déjà envoyés : vérifier les réponses dans la boîte mail et mettre à jour CONTACTS-PDG.md

### 2. Contacter 2 avocats tourisme — 20 minutes
Le dossier `DOSSIER-AVOCAT-EVENTY.docx` (38 pages) est PRÊT. Envoyer un email avec le dossier en PJ :

| Avocat | Email/Site | Action |
|--------|-----------|--------|
| **Maître Emmanuelle Llop** | www.llop-avocat.com → formulaire contact | Envoyer dossier + demander RDV |
| **TourismLex** | tourismlex.com → formulaire contact | Envoyer dossier + demander RDV |

**Objet suggéré** : "Demande de RDV — Création agence de voyages de groupe en ligne (SAS + CGV + contrats)"

---

## LUNDI 23 MARS

### 3. Relancer les 6 contacts si pas de réponse
Appeler par téléphone si pas de réponse email :
- APST : 01 44 09 25 35
- CMB : numéro sur le site
- Hiscox, Chevalier, Nexco, Mutuaide : numéros sur les sites respectifs

### 4. Comparer les devis reçus
Dès qu'un devis arrive, noter dans CONTACTS-PDG.md :
- Prix proposé
- Délai
- Garanties / périmètre
- Note sur 5

---

## SEMAINE 2 (24-28 mars)

### 5. Choisir avocat + expert-comptable
- Signer la lettre de mission expert-comptable
- Valider le périmètre avocat (statuts + CGV + contrats)
- **Budget cible** : 3 000€ - 5 000€ pack complet avocat + 165€-300€/mois comptable

### 6. Lancer la création SAS
- Rédiger les statuts avec l'avocat
- Ouvrir le compte de dépôt Qonto (en ligne, 0€)
- Déposer le capital (2 500€ minimum)

### 7. Rotation credentials Neon DB
- Changer le mot de passe de la base de données (exposé dans .env depuis 5 jours)
- Mettre à jour .env.production avec les nouveaux credentials

---

## SEMAINE 3-4 (31 mars - 11 avril)

### 8. Déposer les dossiers
- Dossier APST (garantie financière)
- Souscription RC Pro (avec le devis choisi)
- Contacter Mutuaide/Europ Assistance pour le Pack Sérénité

### 9. Déployer en production
- Créer le compte Scaleway
- Remplir .env.production (template prêt)
- Exécuter le script de déploiement
- Lancer les 18 tests E2E Playwright

---

## RÉSUMÉ — 3 actions pour aujourd'hui

| # | Action | Temps | Impact |
|---|--------|-------|--------|
| 1 | Envoyer 6 brouillons Gmail | 10 min | Débloque RC Pro + APST + comptable + assurance |
| 2 | Contacter 2 avocats tourisme | 20 min | Débloque SAS + CGV + Atout France |
| 3 | Mettre à jour CONTACTS-PDG.md | 5 min | Tracker les réponses |

**35 minutes aujourd'hui = le chemin critique avance de 2 semaines.**

---

*Créé le 20 mars 2026 — Prochaine MAJ : lundi 23 mars*
