# Sécurisation Serveur Eventy — Guide Opérationnel
> Date : 2026-03-22 | Statut : À exécuter par David

---

## Contexte

Le backend NestJS tourne sur `163.172.189.137:3000` (31 modules, PM2, Nginx).
**Objectif** : Personne ne doit avoir accès au serveur en production tant qu'on n'est pas prêts.

---

## ÉTAPE 1 — Verrouiller le serveur avec le firewall (UFW)

Connecte-toi en SSH :
```bash
ssh root@163.172.189.137
```

Puis exécute ces commandes **une par une** :

```bash
# 1. Activer UFW (firewall)
ufw allow 22/tcp        # SSH — ne PAS oublier sinon tu perds l'accès !
ufw allow from 127.0.0.1 to any port 3000  # Autoriser Node en local seulement
ufw default deny incoming
ufw default allow outgoing
ufw enable              # Répondre "y" quand demandé

# 2. Vérifier le statut
ufw status verbose
```

**Résultat attendu** :
- Port 22 (SSH) ouvert depuis partout → tu peux toujours te connecter
- Port 3000 uniquement depuis localhost → Nginx peut atteindre Node
- Port 80/443 **bloqué** → personne ne peut accéder depuis l'extérieur
- L'API via IP directe (`http://163.172.189.137:3000`) sera inaccessible

### Si tu veux ouvrir temporairement le port 80 pour tester :
```bash
ufw allow 80/tcp        # Ouvrir le port HTTP
ufw status              # Vérifier
# ... tester ...
ufw delete allow 80/tcp # Re-fermer après test
```

### Si tu veux autoriser un accès HTTP seulement depuis Cloudflare (plus tard) :
```bash
# IPs Cloudflare IPv4 — à exécuter quand le domaine sera actif
ufw allow from 173.245.48.0/20 to any port 80
ufw allow from 103.21.244.0/22 to any port 80
ufw allow from 103.22.200.0/22 to any port 80
ufw allow from 103.31.4.0/22 to any port 80
ufw allow from 141.101.64.0/18 to any port 80
ufw allow from 108.162.192.0/18 to any port 80
ufw allow from 190.93.240.0/20 to any port 80
ufw allow from 188.114.96.0/20 to any port 80
ufw allow from 197.234.240.0/22 to any port 80
ufw allow from 198.41.128.0/17 to any port 80
ufw allow from 162.158.0.0/15 to any port 80
ufw allow from 104.16.0.0/13 to any port 80
ufw allow from 104.24.0.0/14 to any port 80
ufw allow from 172.64.0.0/13 to any port 80
ufw allow from 131.0.72.0/22 to any port 80
```

---

## ÉTAPE 2 — Changer les Nameservers chez OVH

Le domaine `eventylife.fr` est en status "Pending Nameserver Update" sur Cloudflare.
**Il faut changer les NS chez OVH pour activer Cloudflare.**

### Procédure :
1. Va sur https://www.ovh.com/manager/ → connecte-toi
2. Menu **Web Cloud** → **Noms de domaine** → `eventylife.fr`
3. Onglet **Serveurs DNS**
4. Clique sur **Modifier les serveurs DNS**
5. Remplace les NS actuels par :
   - `magali.ns.cloudflare.com`
   - `rocco.ns.cloudflare.com`
6. Sauvegarde

### Après le changement :
- Propagation : 1 à 24 heures (généralement 1-2h)
- Va sur Cloudflare → eventylife.fr → clique "Check nameservers now"
- Quand le statut passe de "Pending" à "Active", le domaine est opérationnel

---

## ÉTAPE 3 — Configurer Cloudflare WAF (après activation domaine)

Une fois le domaine actif sur Cloudflare :

1. Dashboard Cloudflare → eventylife.fr → **Security** → **Security rules**
2. Créer une Custom Rule :
   - **Nom** : `Block All Public Access`
   - **Expression** : `(http.host eq "api.eventylife.fr")`
   - **Action** : `Block`
3. Activer la règle

### Pour autoriser ton IP seulement :
- **Expression** : `(http.host eq "api.eventylife.fr" and not ip.src eq TON_IP)`
- **Action** : `Block`

Pour trouver ton IP : va sur https://whatismyip.com

---

## ÉTAPE 4 — Vérifications finales

```bash
# Sur le serveur, vérifier que l'API tourne
pm2 status
curl http://localhost:3000/api/health

# Depuis l'extérieur, vérifier que c'est bloqué
# (devrait timeout ou refuser la connexion)
curl http://163.172.189.137/api/health
curl http://163.172.189.137:3000/api/health
```

---

## Résumé des actions

| # | Action | Qui | Statut |
|---|--------|-----|--------|
| 1 | UFW firewall (bloquer ports 80/3000) | David via SSH | ✅ Fait (22/03/2026) |
| 2 | Changer NS chez OVH → Cloudflare | Claude via OVH Manager | ✅ Fait (22/03/2026) |
| 3 | Attendre propagation DNS (1-24h) | Automatique | ✅ Fait (22/03/2026) — domaine actif sur Cloudflare |
| 4 | Ouvrir port 80 UFW pour IPs Cloudflare | David via SSH | ✅ Fait (22/03/2026) — 15 ranges IPv4 |
| 5 | Créer règle WAF Cloudflare | Claude via dashboard | ✅ Fait (22/03/2026) — "Block All Public Access", action Block |
| 6 | Vérifier https://api.eventylife.fr/api/health | Claude via Chrome | ✅ Fait (22/03/2026) — bloqué par WAF (comportement attendu) |
| 7 | Désactiver WAF pour beta | Claude via dashboard | ✅ Fait (22/03/2026) — règle Disabled |
| 8 | Configurer domaine Vercel + DNS | Claude via Vercel + Cloudflare | ✅ Fait (22/03/2026) |
| 9 | Tester accès beta public | Claude via Chrome | ✅ Fait (22/03/2026) — site + API accessibles |

---

## État actuel du serveur (22/03/2026) — BETA OUVERTE

- ✅ API NestJS : 31 modules chargés, health OK, accessible publiquement
- ✅ PM2 : process `eventy-api` avec auto-restart
- ✅ Nginx : reverse proxy port 80 → 3000
- ✅ PostgreSQL : connectée
- ✅ SSL/TLS Cloudflare : mode Flexible configuré (pour API uniquement)
- ✅ DNS Cloudflare : A record `api` → 163.172.189.137 (Proxied)
- ✅ DNS Cloudflare : A record `eventylife.fr` → 76.76.21.21 (DNS only → Vercel)
- ✅ DNS Cloudflare : CNAME `www` → cname.vercel-dns.com (DNS only → Vercel)
- ✅ Nameservers : changés vers Cloudflare (magali + rocco) — domaine ACTIF
- ✅ Firewall : UFW actif, SSH ouvert, port 80 ouvert pour IPs Cloudflare
- ✅ WAF Cloudflare : règle "Block All Public Access" — DÉSACTIVÉE pour beta
- ✅ Vercel : domaines eventylife.fr + www.eventylife.fr configurés sur projet "eventylife"
- ✅ https://api.eventylife.fr/api/health → {"status":"ok"} accessible
- ✅ https://www.eventylife.fr → PWA Eventy Life (landing page gradient sunset)
- ✅ https://eventylife.fr → redirige 307 vers www.eventylife.fr

### URLs à partager (investisseurs, cofondateurs)
- **Site** : https://eventylife.fr ou https://www.eventylife.fr
- **API** : https://api.eventylife.fr/api/health
- **Swagger (interne)** : http://163.172.189.137:3000/api/docs (accès direct serveur uniquement)
