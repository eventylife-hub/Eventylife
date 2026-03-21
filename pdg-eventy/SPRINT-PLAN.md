# SPRINT PLAN — Eventy Lancement

> **Créé** : 20 mars 2026
> **PDG** : David — eventylife@gmail.com
> **Sprint Goal** : Passer d'un produit tech terminé à un premier voyage bus complet 53 personnes réservé et opéré.
> **Équipe** : David (PDG, 100%) + Claude IA (support illimité)
> **Cadence** : Sprints de 2 semaines — Review chaque vendredi

---

## Vue d'ensemble — 6 Sprints → Premier voyage

```
Sprint 1 (S1-S2)  ► Déblocage administratif + sécurité
Sprint 2 (S3-S4)  ► Création SAS + choix prestataires
Sprint 3 (S5-S6)  ► APST + RC Pro + Pack Sérénité
Sprint 4 (S7-S8)  ► Atout France + Production + Partenaires
Sprint 5 (S9-S10) ► Marketing + Prospection B2B
Sprint 6 (S11-S12)► Premier voyage 53 passagers 🎯
```

---

## Sprint 1 — DÉBLOCAGE (20 mars → 3 avril 2026)

**Sprint Goal** : Débloquer le chemin critique bloqué depuis 15 jours et sécuriser le repo.

### Capacité
| Personne | Jours dispo | Rôle | Notes |
|----------|-------------|------|-------|
| David | 10/10 | PDG — actions manuelles | Priorité absolue : emails + avocats |
| Claude IA | 10/10 | Support — tech + rédaction | DNS, secrets, docs |
| **Total** | **20** | | |

### Backlog Sprint 1
| Priorité | Item | Estimation | Owner | Dépendances | Statut |
|----------|------|------------|-------|-------------|--------|
| **P0** | Envoyer les 6 brouillons Gmail (APST, CMB, Hiscox, Chevalier, Nexco, Mutuaide) | 10 min | David | Aucune | 🔴 BLOQUÉ 15j |
| **P0** | Contacter 2 avocats tourisme (Llop + TourismLex) — envoyer dossier .docx | 30 min | David | Dossier prêt ✅ | ⏳ |
| **P0** | Rotater Stripe Webhook Secret (dashboard Stripe) | 15 min | David | Aucune | 🔴 SÉCURITÉ |
| **P0** | Rotater credentials SMTP (Resend/Brevo) | 15 min | David | Aucune | 🔴 SÉCURITÉ |
| **P0** | Rendre le repo GitHub PRIVÉ | 5 min | David | Aucune | 🔴 SÉCURITÉ |
| **P1** | Configurer DNS eventylife.fr → Vercel (guide prêt) | 30 min | David | Accès OVH | ⏳ |
| **P1** | Relancer les 6 contacts si pas de réponse sous 7 jours | 30 min | David | Sprint 1 P0 emails | ⏳ |
| **P1** | Exécuter migration Prisma sync_v3 sur staging | 1h | Claude | Accès staging DB | ⏳ |
| **P2** | Configurer Sentry monitoring (frontend + backend) | 2h | Claude | Déploiement Vercel OK | ⏳ |
| **P2** | npm audit + mise à jour dépendances | 1h | Claude | npm registry accessible | ⏳ |

### Risques Sprint 1
| Risque | Impact | Mitigation |
|--------|--------|------------|
| David ne fait pas les actions manuelles | Chemin critique reste bloqué +2 semaines | Rappel quotidien, actions de 35 min max |
| Pas de réponse des avocats | SAS retardée de 2-3 semaines | Contacter 2-3 cabinets supplémentaires |
| npm registry toujours en 403 | Audit sécurité impossible | Tester en local sur machine David |

### Definition of Done — Sprint 1
- [ ] 6 emails envoyés (pas en brouillon)
- [ ] 2 avocats contactés avec dossier
- [ ] Secrets GitHub rotatés + repo privé
- [ ] DNS eventylife.fr pointe vers Vercel
- [ ] Migration Prisma exécutée sur staging

---

## Sprint 2 — CRÉATION SAS (4 avril → 17 avril 2026)

**Sprint Goal** : Choisir avocat + expert-comptable et lancer la création de la SAS.

### Backlog Sprint 2
| Priorité | Item | Estimation | Owner | Dépendances |
|----------|------|------------|-------|-------------|
| **P0** | Comparer devis reçus (avocat, comptable, RC Pro, APST) | 2h | David | Réponses emails Sprint 1 |
| **P0** | Choisir et signer avec avocat tourisme | 1h | David | Devis reçus |
| **P0** | Choisir et signer lettre de mission expert-comptable | 1h | David | Devis reçus |
| **P0** | Rédiger statuts SAS avec avocat (objet social large) | Avocat gère | David + Avocat | Avocat choisi |
| **P0** | Ouvrir compte dépôt Qonto + déposer capital 2 500€ | 1h | David | Identité + adresse |
| **P1** | Publier annonce légale (JAL) | 30 min | David | Statuts signés |
| **P1** | Déposer dossier greffe Inpi.fr | 1h | David | Annonce légale publiée |
| **P1** | Tests E2E Playwright (18 specs prêtes) | 4h | Claude | Serveur staging |
| **P2** | Configurer healthcheck externe (UptimeRobot/Checkly) | 1h | Claude | DNS configuré |
| Stretch | Préparer CGV avec avocat (template enrichi prêt) | Avocat gère | Avocat | Avocat choisi |

### Risques Sprint 2
| Risque | Impact | Mitigation |
|--------|--------|------------|
| Aucun devis reçu | Impossible de choisir | Appeler par téléphone + contacter alternatives |
| Avocat indisponible avant mai | SAS retardée | Contacter 3ème cabinet, envisager LegalPlace + avocat CGV |
| Capital insuffisant | SAS bloquée | 2 500€ libérés suffisent légalement (50% de 5 000€) |

### Definition of Done — Sprint 2
- [ ] Avocat tourisme signé
- [ ] Expert-comptable signé
- [ ] Dossier SAS déposé au greffe OU rendez-vous pris
- [ ] Compte Qonto ouvert avec capital déposé
- [ ] Tests E2E passants sur staging

---

## Sprint 3 — AGRÉMENTS (18 avril → 1er mai 2026)

**Sprint Goal** : Obtenir garantie financière APST + RC Pro + contrat Pack Sérénité.

### Backlog Sprint 3
| Priorité | Item | Estimation | Owner | Dépendances |
|----------|------|------------|-------|-------------|
| **P0** | Recevoir Kbis + SIRET | Greffe 1-2 sem | David | Dossier Sprint 2 |
| **P0** | Soumettre dossier APST (garantie financière) | 2h | David | Kbis + business plan |
| **P0** | Souscrire RC Pro (attestation) | 1h | David | Kbis + devis comparés |
| **P0** | Négocier contrat Pack Sérénité (Mutuaide/Europ Assistance) | 2h | David | Kbis |
| **P1** | Vérifier ORIAS (IAS) avec avocat — nécessaire ou pas ? | 30 min | Avocat | Avocat signé |
| **P1** | Configurer Stripe Connect en mode production | 2h | Claude | Kbis + compte Qonto |
| **P1** | Configurer envoi emails en production (Resend/Brevo) | 1h | Claude | DNS vérifié |
| **P2** | Préparer les CGV finales (avocat valide le template) | Avocat gère | Avocat | RC Pro + Pack Sérénité défini |
| Stretch | Adhérer à MTV (Médiation Tourisme Voyage) — gratuit | 30 min | David | Kbis |

### Risques Sprint 3
| Risque | Impact | Mitigation |
|--------|--------|------------|
| Contre-garantie APST exigée (10 000€) | Trésorerie tendue | Prévoir nantissement ou caution bancaire |
| Délai APST > 1 mois | Atout France retardé | Déposer dès Kbis reçu |
| Kbis pas encore reçu | Tout bloqué | Relancer greffe, demander extrait K provisoire |

### Definition of Done — Sprint 3
- [ ] Kbis + SIRET obtenus
- [ ] Dossier APST déposé
- [ ] RC Pro souscrite (attestation en main)
- [ ] Contrat Pack Sérénité signé ou en cours de négociation
- [ ] Stripe Connect configuré en production

---

## Sprint 4 — PRODUCTION + PARTENAIRES (2 mai → 15 mai 2026)

**Sprint Goal** : Immatriculation Atout France déposée + site en production + premiers partenaires contactés.

### Backlog Sprint 4
| Priorité | Item | Estimation | Owner | Dépendances |
|----------|------|------------|-------|-------------|
| **P0** | Déposer dossier Atout France (teleservices.atout-france.fr) | 2h | David | APST + RC Pro + capacité pro |
| **P0** | Déployer backend NestJS en production | 3h | Claude | Hébergeur choisi + .env prod |
| **P0** | Smoke tests production (API + frontend + Stripe + emails) | 2h | Claude | Déploiement OK |
| **P0** | Publier CGV, mentions légales, politique RGPD sur le site | 1h | Claude | CGV validées par avocat |
| **P1** | Prospecter 20 partenaires hébergement (capacité 53+ pers) | 5h | David | Scripts commerciaux prêts ✅ |
| **P1** | Prospecter 10 partenaires activités (capacité 53+ pers) | 3h | David | Templates emails prêts ✅ |
| **P1** | Prospecter 5 transporteurs bus 53 places | 2h | David | Comparatif transport prêt ✅ |
| **P2** | Créer pages "Voyages ouverts" (places ouvertes) sur le site | 3h | Claude | Site en production |
| Stretch | Déposer marque "Eventy" à l'INPI (~210€) | 1h | David | SIRET |

### Risques Sprint 4
| Risque | Impact | Mitigation |
|--------|--------|------------|
| Capacité professionnelle non validée | Atout France refusé | Discuter options VAE/licence avec avocat dès Sprint 2 |
| Aucun partenaire accepte 53 pers minimum | Premier voyage impossible | Cibler chaînes hôtelières + clubs vacances |
| Bug critique en production | Site inutilisable | Sentry + smoke tests + rollback script prêt |

### Definition of Done — Sprint 4
- [ ] Dossier Atout France déposé
- [ ] Site eventylife.fr live en production (frontend + backend)
- [ ] CGV/mentions légales/RGPD publiées
- [ ] 10+ partenaires contactés
- [ ] 3+ réponses positives de partenaires

---

## Sprint 5 — MARKETING + B2B (16 mai → 29 mai 2026)

**Sprint Goal** : Lancer les 6 canaux marketing + signer les premiers contrats partenaires.

### Backlog Sprint 5
| Priorité | Item | Estimation | Owner | Dépendances |
|----------|------|------------|-------|-------------|
| **P0** | Signer 5+ contrats partenaires (hébergement + activités + transport) | 5h | David | Réponses Sprint 4 |
| **P0** | Créer et publier le premier voyage sur eventylife.fr | 3h | David | 1+ hébergement + 1+ transport signés |
| **P0** | Lancer Google Ads (Search B2C + B2B) — budget 400€/mois | 2h | David | Site en production |
| **P1** | Créer comptes réseaux sociaux (Instagram, Facebook, LinkedIn, TikTok) | 2h | David | Brand Guide prêt ✅ |
| **P1** | Publier 10 posts de lancement (contenu prêt via marketing suite) | 3h | David | Comptes créés |
| **P1** | Envoyer 20 messages LinkedIn B2B (séminaires 53 pers) | 2h | David | Profil LinkedIn optimisé |
| **P1** | Écrire et publier 3 articles blog SEO (destinations) | 4h | Claude | Site en production |
| **P2** | Newsletter hebdo "Places ouvertes" — premier envoi | 1h | Claude | Liste email + Brevo configuré |
| Stretch | Configurer Google Analytics 4 + Search Console | 1h | Claude | DNS vérifié |

### Risques Sprint 5
| Risque | Impact | Mitigation |
|--------|--------|------------|
| Pas assez de partenaires signés | Impossible de publier un voyage | Accepter temporairement 1 seul partenaire fiable |
| Google Ads ROAS < 3× | Budget gaspillé | A/B test mots-clés, commencer petit (200€) |
| Immatriculation Atout France pas encore reçue | Vente illégale | NE PAS vendre tant que IM non reçu — page "coming soon" |

### Definition of Done — Sprint 5
- [ ] 5+ contrats partenaires signés
- [ ] Premier voyage publié sur eventylife.fr
- [ ] Google Ads actif
- [ ] Réseaux sociaux lancés (4 plateformes)
- [ ] 3 articles blog publiés

---

## Sprint 6 — PREMIER VOYAGE 🎯 (30 mai → 12 juin 2026)

**Sprint Goal** : Remplir le premier bus de 53 passagers et opérer le voyage.

### Backlog Sprint 6
| Priorité | Item | Estimation | Owner | Dépendances |
|----------|------|------------|-------|-------------|
| **P0** | Atteindre 30+ réservations (seuil minimum viable) | Continu | David | Voyage publié + marketing actif |
| **P0** | Gérer le premier checkout complet (acompte 30% + solde J-30) | 2h | David + Claude | Stripe Connect prod |
| **P0** | Envoyer documents voyage J-15 à tous les participants | 1h | Claude | Templates emails prêts ✅ |
| **P0** | Confirmer le bus 53 places + itinéraire | 2h | David | Transporteur signé |
| **P0** | Confirmer les hébergements (rooming list J-7) | 2h | David | Hôtel signé |
| **P1** | Envoyer rappel J-3 à tous les participants | 30 min | Claude | Automatisation email |
| **P1** | Opérer le voyage (J0 → J+N) | Terrain | David | Tout confirmé |
| **P1** | Envoyer enquête satisfaction J+3 | 30 min | Claude | Retour de voyage |
| **P2** | Collecter les premiers avis clients J+7 | 1h | Claude | Satisfaction > 7/10 |
| Stretch | Premier contenu marketing post-voyage (photos, témoignages) | 2h | David | Voyage terminé |

### Risques Sprint 6
| Risque | Impact | Mitigation |
|--------|--------|------------|
| Bus pas rempli (< 30 personnes) | Voyage non rentable | Ouvrir les places sur eventylife.fr + réseau auto-entrepreneurs |
| Bug Stripe en production | Paiements bloqués | Tester en sandbox avant + backup paiement SEPA |
| Annulation massive (> 30%) | Bus demi-vide | Pack Sérénité couvre les annulations + waitlist |
| Immatriculation toujours pas reçue | IMPOSSIBLE de vendre | Repousser Sprint 6 jusqu'à réception IM |

### Definition of Done — Sprint 6
- [ ] Premier voyage opéré avec succès
- [ ] 30+ passagers transportés
- [ ] Paiements Stripe encaissés sans erreur
- [ ] Satisfaction > 7/10 (enquête J+3)
- [ ] Premiers avis publiés sur le site

---

## Sprints Post-Lancement (Roadmap V2)

Après le Sprint 6, les sprints techniques reprennent selon la [ROADMAP-V2-POST-LANCEMENT.md](ROADMAP-V2-POST-LANCEMENT.md) :

| Sprint | Période | Features | Jours |
|--------|---------|----------|-------|
| **Sprint 7** | M1 post-launch | Module Vendeur (dashboard, commissions, QR) | 11j |
| **Sprint 8** | M2 post-launch | Croissance Virale (UGC, fiche pro, quick sell) | 8j |
| **Sprint 9** | M3 post-launch | Forfaits & Packs (all-inclusive, early bird, fidélité) | 7j |
| **Sprint 10** | M4-M5 post-launch | Portail Hôtelier + Restaurateur | 16j |
| **Sprint 11** | M6 post-launch | Portail Sponsor | 4j |
| **Sprint 12** | M7-M9 post-launch | Route Packs + Charter multi-bus | 19j |
| **Sprint 13** | M10-M12 post-launch | ClosePack Finance + multi-devise | 8j |

---

## Métriques de suivi

| KPI | Sprint 1 | Sprint 3 | Sprint 5 | Sprint 6 |
|-----|----------|----------|----------|----------|
| Emails envoyés | 6+ | — | — | — |
| Contrats signés (avocat, comptable) | 0 | 2+ | — | — |
| Kbis obtenu | Non | Oui | — | — |
| Agréments (APST, RC Pro) | Non | En cours | Obtenus | — |
| Immatriculation IM | Non | Non | En cours | Obtenue |
| Partenaires signés | 0 | 0 | 5+ | 5+ |
| Voyages publiés | 0 | 0 | 1+ | 1+ |
| Réservations | 0 | 0 | 0 | 30+ |
| CA | 0€ | 0€ | 0€ | ~20 000€ |

---

## Rituels

| Rituel | Fréquence | Durée | Qui |
|--------|-----------|-------|-----|
| **Daily standup** | Lun-Ven | 5 min avec Claude | David |
| **Sprint Review** | Vendredi fin de sprint | 15 min | David + Claude |
| **Sprint Planning** | Lundi début de sprint | 15 min | David + Claude |
| **Dashboard update** | Chaque vendredi | Auto | Claude |

---

## Rappel — Le produit tech est PRÊT

> - **345 000+ lignes de code**
> - **201 pages frontend** — 3 portails complets
> - **31 modules backend** — 100+ services — 392+ endpoints
> - **3 300+ tests passants**
> - **0 erreur TypeScript**
> - **18 handlers webhook Stripe**
> - **313 index DB optimisés**
>
> **Il ne manque que les actions humaines de David pour lancer.** Le Sprint 1 est déblocable en 35 minutes d'actions manuelles.

---

*Créé le 20 mars 2026 — Prochain review : vendredi 3 avril 2026*
