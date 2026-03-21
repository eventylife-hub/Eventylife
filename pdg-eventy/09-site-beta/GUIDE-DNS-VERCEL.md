# Guide Configuration DNS — OVH vers Vercel

> **Date de création** : 2026-03-20
> **Statut** : Guide complet pour configuration DNS eventylife.fr
> **Cible** : Déploiement production site Vercel
> **Domaine** : eventylife.fr (OVH Registrar)
> **Hébergement frontend** : Vercel
> **Email** : Google Workspace (optionnel futur)

---

## Vue d'ensemble

Ce guide vous accompagne pas à pas pour :
1. **Connecter votre domaine OVH** à votre déploiement Vercel
2. **Configurer les enregistrements DNS** (A, CNAME)
3. **Ajouter le domaine personnalisé** dans Vercel
4. **Activer SSL/TLS** (certificat auto)
5. **Optionnel : Configurer la messagerie** Google Workspace (MX, SPF, DKIM, DMARC)
6. **Vérifier et tester** la configuration

---

## 1. Prérequis

Avant de commencer, vous devez avoir :

- ✅ Un compte **OVH** avec accès à la gestion DNS de `eventylife.fr`
- ✅ Un compte **Vercel** avec le projet Eventy déployé
- ✅ L'URL de déploiement Vercel : `eventylife-kqx8g9oex-eventylife-hubs-projects.vercel.app`
- ✅ Accès administrateur à la zone DNS OVH

---

## 2. Configuration DNS chez OVH — Étape par étape

### 2.1 Accéder à votre zone DNS OVH

1. Connectez-vous à votre compte **OVH** → https://www.ovh.com/manager/web/
2. Dans le menu de gauche, sélectionnez **Domaines** → **eventylife.fr**
3. Onglet **Zone DNS**
4. Vous verrez la liste des enregistrements existants

### 2.2 Configuration de l'enregistrement racine (A record)

**Objectif** : Faire pointer `eventylife.fr` (sans www) vers Vercel

**Instructions** :

1. Dans la zone DNS, cherchez l'enregistrement **A** pour le domaine racine (@)
   - Si vous voyez un A record existant → **Modifiez-le**
   - Si absent → **Créez-en un nouveau**

2. **Modifiez/Créez** l'enregistrement A :

   | Champ | Valeur |
   |-------|--------|
   | Sous-domaine | @ (racine) |
   | Type | A |
   | Cible | **76.76.21.21** |
   | TTL | 3600 (par défaut) |

3. **Sauvegardez**

4. **Notes importantes** :
   - L'adresse **76.76.21.21** est fournie par Vercel pour les domaines personnalisés
   - Les modifications DNS peuvent prendre **15 minutes à 48 heures** pour se propager
   - Si vous aviez un ancien A record (ex. 213.186.33.5), il sera remplacé

### 2.3 Configuration du sous-domaine www (CNAME)

**Objectif** : Faire pointer `www.eventylife.fr` vers Vercel via un alias

**Instructions** :

1. Dans la zone DNS, cherchez l'enregistrement **CNAME** pour le sous-domaine `www`
   - Si vous voyez un CNAME existant → **Modifiez-le**
   - Si absent → **Créez-en un nouveau**

2. **Modifiez/Créez** l'enregistrement CNAME :

   | Champ | Valeur |
   |-------|--------|
   | Sous-domaine | www |
   | Type | CNAME |
   | Cible | **cname.vercel-dns.com.** |
   | TTL | 3600 (par défaut) |

3. **Sauvegardez**

4. **Notes importantes** :
   - Le point à la fin (`cname.vercel-dns.com.`) est important — ne l'oubliez pas
   - Vercel gère automatiquement le routage vers votre déploiement

### 2.4 Suppression des anciens enregistrements (si applicable)

Si vous migrez depuis un ancien hébergeur, **supprimez les anciens enregistrements** :

- Anciens A records (ex. IP Scaleway, OVH)
- Anciens CNAME records (ex. vers votre ancien hébergeur)
- Tout enregistrement incompatible

**Risque** : Si deux A records pointent vers des serveurs différents, le DNS alternera aléatoirement, créant des **problèmes intermittents**.

---

## 3. Configuration dans le Dashboard Vercel

### 3.1 Ajouter le domaine personnalisé

1. Connectez-vous à **Vercel** → https://vercel.com/dashboard
2. Sélectionnez le projet **eventylife**
3. Allez dans **Settings** → **Domains**
4. Cliquez sur **Add Domain**
5. Entrez votre domaine : `eventylife.fr`
6. Cliquez **Add**

### 3.2 Vérifier les enregistrements DNS

Vercel affichera une **Nameserver Configuration** ou **DNS Records** :

Vous verrez quelque chose comme :

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com.
```

**✅ Comparez avec votre configuration OVH** — ils doivent être identiques.

### 3.3 Vérifier la validation du domaine

- **Statut "Valid"** (vert) = DNS configuré correctement ✅
- **Statut "Pending"** (orange) = En attente de propagation DNS (attendre 15 min à 2h)
- **Statut "Invalid"** (rouge) = Erreur de configuration → relire l'étape 2

Si le statut reste "Pending", attendez 1-2 heures, puis cliquez **Refresh**.

---

## 4. Configuration SSL/TLS (Certificat HTTPS)

### 4.1 Certificat auto Vercel

**Bonne nouvelle** : Vercel crée automatiquement un certificat SSL/TLS gratuit pour votre domaine une fois que :

1. Les enregistrements DNS sont validés
2. Le domaine est ajouté dans Vercel
3. La propagation DNS est complète

### 4.2 Vérifier le certificat

Après **30-60 minutes** :

1. Allez sur **Settings** → **Domains** dans Vercel
2. Cherchez le domaine `eventylife.fr`
3. Vérifiez que **SSL/TLS Status** indique ✅ **Valid Certificate**

### 4.3 Tester HTTPS

Visitez votre site :

```
https://eventylife.fr
https://www.eventylife.fr
```

Vous devez voir le **cadenas vert** (connexion sécurisée) dans la barre d'adresse.

**En cas de problème** :

- Si vous voyez "Certificate not yet ready" → attendre 1-2h supplémentaires
- Si le certificat reste invalide → vérifier que les enregistrements DNS OVH sont bien configurés
- Tester avec : `dig eventylife.fr` (voir section 7 — Dépannage)

---

## 5. Configuration Email — Google Workspace (optionnel)

Si vous utilisez **Google Workspace** pour la messagerie professionelle (`contact@eventylife.fr`, `sinistre@eventylife.fr`, etc.) :

### 5.1 Enregistrements MX (Mail eXchange)

**Objectif** : Dire au monde que les emails pour `eventylife.fr` doivent aller aux serveurs Google

1. Dans OVH → Zone DNS → Cherchez les enregistrements **MX** existants
2. Supprimez les **anciens MX records** (s'il y en a)
3. Créez les **nouveaux enregistrements MX** pour Google Workspace :

   | Sous-domaine | Type | Priorité | Cible | TTL |
   |--------------|------|----------|-------|-----|
   | @ | MX | 5 | aspmx.l.google.com. | 3600 |
   | @ | MX | 10 | alt1.aspmx.l.google.com. | 3600 |
   | @ | MX | 20 | alt2.aspmx.l.google.com. | 3600 |
   | @ | MX | 30 | alt3.aspmx.l.google.com. | 3600 |
   | @ | MX | 40 | alt4.aspmx.l.google.com. | 3600 |

4. **Sauvegardez**

**Note** : Les priorités (5, 10, 20...) indiquent l'ordre de préférence. Verifiez que vous copiez exactement depuis Google Admin Console.

### 5.2 Enregistrement SPF (Sender Policy Framework)

**Objectif** : Authentifier les emails envoyés par eventylife.fr

1. Dans OVH → Zone DNS → Créez un enregistrement **TXT** :

   | Sous-domaine | Type | Valeur | TTL |
   |--------------|------|--------|-----|
   | @ | TXT | `v=spf1 include:_spf.google.com ~all` | 3600 |

2. **Sauvegardez**

**Explications** :
- `v=spf1` : version SPF
- `include:_spf.google.com` : utilise les serveurs SPF de Google
- `~all` : tous les autres serveurs sont "softfail" (accepté mais marqué comme suspect)

### 5.3 Enregistrements DKIM (DomainKeys Identified Mail)

**Objectif** : Signer cryptographiquement vos emails

Cette étape se fait dans **Google Admin Console**, pas OVH.

**À faire dans Google Workspace** :

1. Allez à **Google Admin Console** → **Apps** → **Google Workspace** → **Gmail** → **Manage DKIM signing**
2. Cliquez **Start authentication** pour votre domaine
3. Google génère une clé DKIM
4. Copiez la clé DKIM fournie par Google
5. Créez l'enregistrement **TXT** OVH correspondant

**Exemple d'enregistrement DKIM** (OVH) :

| Sous-domaine | Type | Valeur | TTL |
|--------------|------|--------|-----|
| google._domainkey | TXT | `v=DKIM1; k=rsa; p=[VOTRE_CLE_PUBLIQUE_GOOGLE]` | 3600 |

> **Note** : Consultez la documentation Google Workspace pour les valeurs exactes.

### 5.4 Enregistrement DMARC (Domain-based Message Authentication)

**Objectif** : Politique de rapport pour les emails non authentifiés

1. Dans OVH → Zone DNS → Créez un enregistrement **TXT** :

   | Sous-domaine | Type | Valeur | TTL |
   |--------------|------|--------|-----|
   | _dmarc | TXT | `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@eventylife.fr` | 3600 |

2. **Sauvegardez**

**Explications** :
- `v=DMARC1` : version DMARC
- `p=quarantine` : emails non authentifiés vont dans les spams (plus sûr que `p=reject`)
- `rua=mailto:dmarc-reports@eventylife.fr` : rapports DMARC envoyés à cette adresse

---

## 6. Vérification — Checklist complète

Après avoir configuré tout, vérifiez :

### DNS OVH
- [ ] A record `@` → 76.76.21.21
- [ ] CNAME `www` → cname.vercel-dns.com.
- [ ] MX records (optionnel, si Google Workspace)
- [ ] SPF record (optionnel)
- [ ] DKIM record (optionnel)
- [ ] DMARC record (optionnel)

### Vercel Dashboard
- [ ] Domaine `eventylife.fr` ajouté
- [ ] Statut DNS : **Valid** ✅
- [ ] SSL/TLS Status : **Valid Certificate** ✅

### Test depuis le navigateur
- [ ] https://eventylife.fr charge le site
- [ ] https://www.eventylife.fr charge le site
- [ ] Cadenas vert dans la barre d'adresse
- [ ] Pas d'avertissement de certificat

### Vérification technique (optionnel, mais recommandé)
```bash
# Vérifier A record
nslookup eventylife.fr

# Vérifier CNAME www
nslookup www.eventylife.fr

# Vérifier MX records (si email)
nslookup -type=MX eventylife.fr

# Vérifier SPF
nslookup -type=TXT eventylife.fr
```

---

## 7. Dépannage — Problèmes courants

### "Le site ne charge pas" ou "Site indisponible"

**Cause possible** : DNS n'est pas propagé ou enregistrements incorrects

**Solutions** :

1. **Vérifiez le statut DNS dans Vercel**
   - Settings → Domains → vérifiez le statut du domaine
   - S'il est "Pending", attendez 30 min à 2h

2. **Videz le cache DNS local** (Windows) :
   ```bash
   ipconfig /flushdns
   ```

3. **Testez avec un DNS en ligne** :
   - Allez à https://mxtoolbox.com/
   - Entrez `eventylife.fr`
   - Vérifiez que le A record pointe bien vers 76.76.21.21

4. **Vérifiez OVH**
   - Zone DNS → A record pour `@` est-il bien 76.76.21.21 ?
   - CNAME pour `www` est-il bien `cname.vercel-dns.com.` ?

### "Certificate error" ou "Not secure"

**Cause possible** : SSL/TLS n'est pas encore activé ou configuration incomplète

**Solutions** :

1. Attendez 60 minutes après avoir configuré le domaine
2. Vérifiez dans Vercel → Settings → Domains → SSL/TLS Status
3. Si toujours "Invalid" après 2h, vérifiez que vos enregistrements DNS OVH sont **exactement** :
   - A record `@` = 76.76.21.21
   - CNAME `www` = cname.vercel-dns.com.
4. Si vous venez de modifier les enregistrements, videz le cache DNS et attendez

### "Domaine pointe vers le mauvais site" (ou site de transition OVH)

**Cause possible** : DNS cache stale ou ancien A record encore actif

**Solutions** :

1. Vérifiez que **les anciens enregistrements A/CNAME ont été supprimés** chez OVH
2. Videz le cache DNS : `ipconfig /flushdns` (Windows) ou `sudo dscacheutil -flushcache` (Mac)
3. Patientez 24h maximum pour la propagation complète

### "Email ne délivre pas" (si Google Workspace)

**Cause possible** : MX records manquants ou SPF/DKIM non configurés

**Solutions** :

1. Vérifiez les enregistrements MX chez OVH
2. Vérifiez SPF et DKIM
3. Testez avec https://mxtoolbox.com/ → Email Validator
4. Attendez 2-4h après chaque modification MX

---

## 8. Après la configuration — Prochaines étapes

### Jour J+1 (lendemain)
- ✅ Vérifier que le site est accessible en HTTPS
- ✅ Tester sur mobile
- ✅ Vérifier les logs Vercel (pas d'erreurs 500)

### Jour J+7 (une semaine)
- ✅ Configurer Google Workspace (si non encore fait)
- ✅ Tester l'envoi d'emails
- ✅ Vérifier la délivrabilité des emails (SPF, DKIM, DMARC)
- ✅ Configurer monitoring Vercel Analytics

### Mensuel
- ✅ Surveillance DNS : renouvellement domaine OVH (24 mois)
- ✅ Certificats SSL : automatique, pas d'action requise
- ✅ Performance du site : dashboard Vercel

---

## 9. Contacts et ressources

| Besoin | URL / Contact |
|--------|---------------|
| Dashboard OVH | https://www.ovh.com/manager/web/ |
| Dashboard Vercel | https://vercel.com/dashboard |
| Support OVH DNS | https://www.ovh.com/fr/support/ |
| Support Vercel | https://vercel.com/support |
| Google Workspace DKIM | https://support.google.com/a/answer/174125 |
| Test DNS en ligne | https://mxtoolbox.com/ |
| Test SSL/TLS | https://www.ssllabs.com/ssltest/ |

---

## 10. Résumé visuel — Le chemin du domaine

```
User tape : https://eventylife.fr
            ↓
        ┌───────────────┐
        │   OVH (DNS)   │
        │  A → 76.76... │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │   Vercel      │
        │   Déploiement │
        └───────┬───────┘
                ↓
        https://eventylife.fr
        ✅ Sécurisé (SSL)
        ✅ Rapide (CDN Vercel)
```

---

## Historique des modifications

| Date | Modification | Auteur |
|------|--------------|--------|
| 2026-03-20 | Création du guide complet DNS OVH → Vercel | PDG Eventy |

**Status** : ✅ **Prêt pour production**
