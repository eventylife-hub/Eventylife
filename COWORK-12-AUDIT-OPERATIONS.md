# COWORK-12 — Audit Opérationnel Complet (Gmail + Vercel + Sécurité)

**Date** : 2026-03-20
**Objectif** : Utiliser tous les outils disponibles (Gmail, Vercel, GitHub) pour auditer l'état réel du projet

---

## Résumé exécutif

Sprint d'audit opérationnel profond — première fois qu'on vérifie l'état réel des emails, déploiements et sécurité avec accès direct aux outils. **Résultats alarmants sur le plan business, encourageants sur le plan technique.**

---

## 🔴 CONSTAT #1 — 6 emails JAMAIS envoyés (15 jours de retard)

**Audit Gmail** : Les 6 brouillons créés le 5 mars sont TOUJOURS en brouillon.

| # | Destinataire | Objet |
|---|-------------|-------|
| 1 | info@apst.travel | Adhésion APST |
| 2 | contact@cmb-assurances.fr | RC Pro |
| 3 | contact@chevalierconseil.com | Expert-comptable |
| 4 | contact@nexco-expertise.com | Expert-comptable TVA marge |
| 5 | contact@hiscox.fr | RC Pro Atout France |
| 6 | assistance@mutuaide.fr | Assurance voyage groupe |

**Emails envoyés depuis le compte** : 0 (zéro, hors auto-HubSpot du 01/03)
**Emails reçus pertinents** : 0 réponse business

**Impact** : Tout le chemin critique P0 est gelé depuis 15 jours.

---

## 🔴 CONSTAT #2 — Secrets exposés sur GitHub public

**GitGuardian (18/03)** : SMTP credentials détectées dans commit `905e2825`
**GitHub Secret Scanning (18/03)** : Stripe Webhook Signing Secret dans `.env.example` ligne 21

**Le repo eventylife-hub/Eventylife est PUBLIC.**

### Actions correctives effectuées (Cowork-12)
- ✅ `.gitignore` renforcé (racine + backend) — `.env.*` bloqué sauf `.example`
- ✅ `.env.example` backend vérifié — contient des placeholders (OK)
- ⚠️ Le commit historique `905e2825` contient les vrais secrets — nécessite rotation

### Actions requises par David
1. Rotater le Stripe Webhook Secret (dashboard.stripe.com)
2. Rotater les credentials SMTP (Resend ou Brevo)
3. Rotater le mot de passe Neon DB
4. Envisager : rendre le repo PRIVÉ sur GitHub

---

## 🟢 CONSTAT #3 — Vercel frontend déployé et live

| Métrique | Valeur |
|----------|--------|
| Projet Vercel | `eventylife` (prj_FsEfuhrAYGi8TvLqaZiUBFIbClct) |
| Team | eventylife-hub (team_qt1sALhqb7dKOdUrnjoaAepT) |
| Dernier deploy PROD réussi | **18/03/2026** — `c969bf29` |
| Statut | ✅ READY (production) |
| URL preview | eventylife-kqx8g9oex-eventylife-hubs-projects.vercel.app |
| Deploys master (19-20/03) | 3 READY (preview, pas production) |
| Deploys en erreur passés | 5 entre 16/03-18/03 (tous corrigés) |

**Le frontend est live sur Vercel.** Les 3 derniers commits (docs/audit) sont sur `master` en preview, pas en production. Le dernier deploy `main` prod est fonctionnel.

---

## 🟡 CONSTAT #4 — Environnement externe

| Service | Statut |
|---------|--------|
| **OVHcloud** | ✅ Domain eventylife.fr actif (email satisfaction reçu 20/03) |
| **GitHub** | ✅ Repo actif, commits réguliers, CI/CD Vercel branché |
| **Slack** | ⚠️ Essai Pro terminé le 20/03 — retour au plan gratuit |
| **GitLab** | ⚠️ Trial ending dans ~3 jours |
| **HubSpot** | ✅ Connecté depuis 01/03 |
| **Vercel** | ✅ Deploiements actifs, plan Hobby |

---

## Corrections techniques effectuées

1. **`.env.example` backend** — Corrigé `eventy.life` → `eventylife.fr` (2 occurrences)
2. **`.gitignore` racine** — Renforcé : `.env.*` bloqué, sauf `*.example`
3. **`.gitignore` backend** — Même renforcement
4. **DASHBOARD-PDG.md** — Réécrit section alertes avec constats réels Gmail/Vercel/Sécurité
5. **CONTACTS-PDG.md** — Statut de tous les contacts corrigé : "BROUILLON — JAMAIS ENVOYÉ"

---

## Priorités immédiates pour David

### Ce soir (20/03)
1. 📧 **Envoyer les 6 brouillons Gmail** — 2 minutes, impact maximal
2. 🔐 **Rotater Stripe webhook secret** — dashboard.stripe.com → Developers → Webhooks
3. 🔐 **Rotater SMTP credentials** — Resend ou Brevo dashboard

### Cette semaine (21-27/03)
4. 🌐 **Configurer DNS** — OVH → ajouter CNAME vers Vercel pour eventylife.fr
5. 🔒 **Rendre le repo GitHub privé** — Settings → Danger Zone → Make private
6. 📞 **Relancer par téléphone** si pas de réponse aux emails sous 3 jours ouvrés

### Semaine suivante
7. Avocat tourisme (APST donnera des contacts)
8. Finaliser choix expert-comptable
9. Lancer dossier Atout France
