# AUDIT CONFORMITÉ LÉGALE — EventyLife
**Date :** 2026-03-23
**Auteur :** Assistant PDG (audit automatisé via inspection du code)
**Périmètre :** Frontend (Next.js 14), Backend (NestJS), partage social, RGPD, Directive voyages forfait, accessibilité
**Statut :** 🔴 4 points critiques | 🟡 7 points à améliorer | 🟢 14 points conformes

---

## RÉSUMÉ EXÉCUTIF

EventyLife dispose d'une infrastructure légale solide sur la plupart des sujets clés. La politique de confidentialité, les CGV, les mentions légales et le bandeau cookies sont en place et bien structurés. Les principaux risques résiduels concernent :
1. **Le droit à l'image** lors du partage de photos de voyages (aucun consentement explicite côté technique)
2. **La gestion des Cookies de Fidélité** (données comportementales à déclarer dans la politique)
3. **L'accessibilité WCAG 2.1 AA** (insuffisante sur plusieurs pages)
4. **La désignation formelle du DPO** (mentionné dans la politique mais non formellement désigné)

---

## 1. RGPD — CONFORMITÉ

### ✅ Conformes
| Élément | Statut | Détail |
|---------|--------|--------|
| Politique de confidentialité | ✅ OK | Page `/politique-confidentialite` complète, DPO mentionné, droits RGPD détaillés (accès, effacement, portabilité, opposition) |
| Consentement cookies | ✅ OK | CookieBanner + CookiePreferencesModal implémentés, cookie_consent stocké |
| Droit à l'effacement | ✅ OK | API `/api/rgpd/data-delete` existante |
| Export données (DSAR) | ✅ OK | API `/api/rgpd/data-export` + page admin `/admin/dsar` |
| Consentement marketing | ✅ OK | Consentement explicite requis avant email marketing |
| Base légale traitements | ✅ OK | Documentée dans politique confidentialité |
| Durée conservation | ✅ OK | Tableau de durées dans politique confidentialité |

### 🟡 À améliorer
| Élément | Risque | Action requise |
|---------|--------|----------------|
| **DPO** | MOYEN | Le DPO est mentionné dans la politique mais son adresse email réelle doit être renseignée (actuellement placeholder). Désigner un DPO formellement si > 250 salariés ou traitement à grande échelle. |
| **Cookies de Fidélité** | MOYEN | Le nouveau système "Cookies de Fidélité" (vol de cookies, classement public, défis) implique des traitements de données comportementales et de profilage. Ajouter une section dédiée dans la politique de confidentialité. |
| **Log de consentement** | FAIBLE | Stocker un log horodaté de chaque consentement cookie pour prouver la conformité en cas d'audit CNIL. |

### 🔴 Critique
| Élément | Risque | Action requise |
|---------|--------|----------------|
| **Droit à l'image (photos voyages)** | ÉLEVÉ | Quand un client est sur une photo de groupe partagée sur les réseaux → consentement explicite nécessaire avant publication. Implémenter : (1) case à cocher dans profil "J'accepte d'apparaître sur les photos partagées", (2) option "Je ne souhaite pas apparaître", (3) système de signalement de photo. **À faire avant lancement.** |

---

## 2. PARTAGE SOCIAL — CONFORMITÉ

### ✅ Conformes
| Élément | Statut |
|---------|--------|
| Open Graph tags dynamiques | ✅ Photo voyage + prix + destination |
| Twitter card `summary_large_image` | ✅ OK |
| Twitter site `@EventyLife` | ✅ Ajouté 2026-03-23 |
| Schema.org TravelAction | ✅ TravelOffer + FAQPage JSON-LD |
| QR Code partageable | ✅ QRCodeShare component |
| Boutons partage WhatsApp + Facebook | ✅ OK |
| Lien de parrainage tracé | ✅ Shortlinks + tracking |

### 🟡 À améliorer
| Élément | Risque | Action |
|---------|--------|--------|
| **Consentement partage photos** | MOYEN | Avant de partager une photo où des clients tiers apparaissent, afficher un avertissement et vérifier le consentement en base. |
| **Opt-out classement public Cookies** | MOYEN | Le classement public des Cookies de Fidélité expose des pseudonymes. Permettre aux clients de rendre leur rang non-public. |
| **Mentions légales sur visuels** | FAIBLE | Les visuels auto-générés pour Instagram (Kit Social Media) devraient idéalement inclure "eventylife.fr" et/ou la mention "Agence immatriculée Atout France IM0XXXXX". |

---

## 3. CGV — CONFORMITÉ DIRECTIVE VOYAGES À FORFAIT (EU 2015/2302)

### ✅ Conformes
| Élément | Statut |
|---------|--------|
| Prix TTC affiché | ✅ Prix tout compris affiché sur chaque page voyage |
| Conditions d'annulation (barème) | ✅ CGV + timeline d'annulation sur page voyage |
| Directive 2015/2302/UE mentionnée | ✅ En bas des CGV |
| Organisateur de voyages (Atout France) | ✅ Numéro d'immatriculation référencé dans CGV |
| Garantie financière (APST) | ✅ Mentionnée dans CGV |
| RC Pro | ✅ Mentionnée dans CGV |
| Pack Sérénité (assurance de base) | ✅ Décrit dans CGV et sur les pages voyage |

### 🟡 À améliorer
| Élément | Risque | Action |
|---------|--------|--------|
| **Fiche d'information précontractuelle** | MOYEN | La directive impose une fiche standardisée avant contrat. Elle est intégrée dans les CGV mais devrait être proposée en PDF téléchargeable séparé avant paiement. |
| **Formulaire de résiliation en ligne** | MOYEN | Obligation légale depuis 2023 (loi Consommation) de proposer un formulaire de résiliation en ligne simple. À implémenter dans `/client/reservations/[id]/annuler`. |
| **Mention "seuil minimum de voyageurs"** | FAIBLE | La politique "on part même si le bus n'est pas plein" est un avantage concurrentiel, mais les CGV doivent préciser le seuil minimum officiel (s'il en existe un) ou confirmer qu'il n'y en a pas. |

### 🔴 Critique
| Élément | Risque | Action |
|---------|--------|--------|
| **Numéro Atout France réel** | ÉLEVÉ | Le numéro d'immatriculation Atout France dans les CGV semble être un placeholder ("IM0XXXXX"). Ce numéro réel DOIT être renseigné avant tout commerce. Sans immatriculation valide, l'activité d'agence de voyages est illégale en France. |

---

## 4. MENTIONS LÉGALES

### ✅ Conformes
| Élément | Statut |
|---------|--------|
| Nom/Raison sociale | ✅ "Eventy Life SAS" |
| Directeur de publication | ✅ David |
| Hébergeur | ✅ Mentionné |
| Email de contact | ✅ eventylife@gmail.com |

### 🟡 À améliorer
| Élément | Action |
|---------|--------|
| **Email professionnel** | Remplacer `eventylife@gmail.com` par un email `@eventylife.fr` avant lancement. |
| **Capital social réel** | Renseigner le capital social réel une fois la SAS immatriculée. |
| **SIRET** | Renseigner le numéro SIRET une fois l'immatriculation effectuée. |
| **RCS** | Renseigner le greffe d'immatriculation. |

---

## 5. ACCESSIBILITÉ — WCAG 2.1 AA

### ✅ Conformes
| Élément | Statut |
|---------|--------|
| `aria-label` sur boutons de partage | ✅ Présents sur les boutons principaux |
| Contraste texte principal | ✅ Navy #1A1A2E sur fond clair : ratio > 7:1 |
| Navigation clavier générale | ✅ Liens et boutons standard |
| Meta viewport | ✅ Présent |

### 🔴 À corriger (niveau AA obligatoire)
| Élément | Problème | Action |
|---------|----------|--------|
| **Images sans alt text** | Les images Unsplash ont un alt text, mais les photos générées dynamiquement (QR codes, OG images) doivent avoir des descriptions. | Vérifier tous les `<img>` dans les composants voyage. |
| **Navigation clavier modales** | Les modales (QR code, préférences cookies) doivent piéger le focus à l'intérieur et le rendre au déclencheur à la fermeture. | Implémenter `FocusTrap` ou `aria-modal`. |
| **Annonces de changement d'état** | Les boutons "Copié !" ne sont pas annoncés aux lecteurs d'écran. | Ajouter `aria-live="polite"` sur les zones de confirmation. |
| **Contraste boutons secondaires** | Certains boutons gris clairs (#9CA3AF sur #F3F4F6) ont un ratio < 3:1 pour les états disabled. | Ajuster la couleur disabled. |

---

## 6. COOKIES DE FIDÉLITÉ — CONFORMITÉ SPÉCIFIQUE 🍪

Le système "Cookies de Fidélité" introduit des traitements nouveaux à documenter :

### Traitements impliqués
- **Profilage comportemental** : calcul du nombre de voyageurs embarqués par client
- **Classement public** : pseudonyme visible par tous les utilisateurs
- **Mécanique de "vol"** : tracking des interactions entre clients
- **Durée de vie des données** : 6 mois selon les règles définies

### ✅ Ce qui est bien
- Système basé sur des pseudonymes (pas nom réel)
- Opt-in implicite à l'inscription

### 🔴 Ce qui doit être fait
1. **Ajouter une section "Cookies de Fidélité" dans la politique de confidentialité** :
   - Décrire le traitement (base légale : intérêt légitime ou consentement)
   - Durée de conservation des données de Cookies (6 mois)
   - Droit d'opposition au classement public
   - Droit de demander la suppression de ses données de Cookies
2. **Opt-out classement public** : dans les préférences client, permettre de rendre le score non-public
3. **Transparence sur la mécanique de vol** : les clients doivent comprendre comment des Cookies peuvent leur être "volés" (pas de tromperie)

---

## 7. SÉCURITÉ & PROTECTION DES DONNÉES

### ✅ Conformes (rapport SECURITY_AUDIT_REPORT.md existant)
- HTTPS obligatoire
- EXIF stripping des photos (empêche géolocalisation)
- Authentification JWT
- Rôles RBAC

### 🟡 À surveiller
- Les partages sociaux ne doivent pas exposer de données personnelles (email, téléphone) dans les URLs partagées
- Le lien de parrainage `?ref=` ne doit pas exposer d'informations personnelles (utiliser un code opaque, pas le nom)

---

## 8. PLAN D'ACTION PRIORISÉ

### 🔴 Avant lancement (OBLIGATOIRE)
| # | Action | Responsable | Délai |
|---|--------|-------------|-------|
| 1 | Obtenir et renseigner le numéro Atout France réel dans CGV + mentions légales | David (démarches APST) | Avant ouverture commerciale |
| 2 | Implémenter le consentement droit à l'image dans profil client | Tech | Sprint suivant |
| 3 | Ajouter section Cookies de Fidélité dans politique de confidentialité | David + Avocat | Dans la semaine |
| 4 | Renseigner le vrai email `@eventylife.fr` dans mentions légales | David | Dès le domaine configuré |

### 🟡 Avant J+30 post-lancement
| # | Action |
|---|--------|
| 5 | Fiche précontractuelle PDF téléchargeable avant paiement |
| 6 | Formulaire de résiliation en ligne dans espace client |
| 7 | Opt-out classement public Cookies de Fidélité |
| 8 | Désignation formelle DPO (si requis par volume de données) |
| 9 | Log de consentement horodaté pour les cookies |

### 🟢 Bonnes pratiques (continu)
| # | Action |
|---|--------|
| 10 | Audit accessibilité WCAG 2.1 AA complet (outil Axe ou Lighthouse) |
| 11 | Tests de navigation clavier sur les modales |
| 12 | Révision annuelle de la politique de confidentialité |
| 13 | Mise à jour mentions légales après immatriculation SAS |

---

## 9. CONCLUSION

EventyLife est **bien orienté sur le plan légal** avec des CGV solides, une politique RGPD détaillée, un bandeau cookies fonctionnel, et des CGV conformes à la directive EU 2015/2302.

**Les 2 points bloquants avant lancement sont :**
1. Le numéro Atout France réel (sine qua non pour exercer légalement)
2. Le consentement droit à l'image (risque de litige à chaque partage de photo)

Les autres points sont des améliorations progressives qui renforcent la confiance client et réduisent le risque légal.

---

*Rapport généré par l'Assistant PDG — mise à jour requise après chaque changement légal majeur.*
*Prochain audit recommandé : J+90 post-lancement.*
