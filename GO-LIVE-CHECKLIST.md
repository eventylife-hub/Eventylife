# GO-LIVE CHECKLIST — Eventy Production Deployment

**Last Updated**: 2026-03-19
**Status**: Pre-Launch Phase
**Target Launch**: TBD (depends on legal + infrastructure completion)

---

## Executive Summary — Deployment Readiness

| Phase | Items | Done | Bloquant | Owner |
|-------|-------|------|----------|-------|
| **1. Legal & Compliance** | 5 | 0 | YES | David |
| **2. Infrastructure** | 7 | 0 | YES | Tech Lead |
| **3. Security** | 8 | 0 | YES | Security Officer |
| **4. Backend & Migrations** | 6 | 0 | YES | Backend Lead |
| **5. Frontend & SEO** | 7 | 0 | YES | Frontend Lead |
| **6. Payments & Webhooks** | 5 | 0 | YES | Product Manager |
| **7. Email & Communications** | 5 | 0 | NO | Marketing |
| **8. Performance & Load Testing** | 5 | 0 | NO | DevOps |
| **9. Monitoring & Observability** | 5 | 0 | NO | DevOps |
| **10. Post-Launch Support** | 5 | 0 | NO | CEO + Team |
| **TOTAL** | 58 | 0 | 8 blocking | — |

---

# PHASE 1 — LEGAL & COMPLIANCE ⚖️ [BLOCKING]

## 1.1 Structure Juridique

- [ ] **SAS Créée** → Statuts signés + KBIS reçu
  - Owner: David
  - Deadline: ASAP
  - Status: ❌ Pending
  - Contact: Avocat Tourisme
  - Evidence: KBIS scan in `pdg-eventy/01-legal/`

- [ ] **Capital Social Constitué** → Apports versés + procès-verbal AGO
  - Owner: David + Expert-Comptable
  - Deadline: +3 jours après SAS
  - Status: ❌ Pending
  - Evidence: Certificat de dépôt + PV AGO

- [ ] **Numéro SIRET Obtenu** → Via INSEE
  - Owner: Expert-Comptable
  - Deadline: Auto (24-72h après KBIS)
  - Status: ❌ Pending
  - Evidence: Avis SIRET

---

## 1.2 Certifications & Autorisations Tourisme

- [ ] **Atout France — Dossier Déposé** → Immatriculation agence de voyages
  - Owner: David
  - Deadline: J+7 après SAS créée
  - Status: ❌ Pending
  - Doc: `pdg-eventy/01-legal/IMMATRICULATION-ATOUT-FRANCE.md`
  - Contacts: Atout France (direction générale)
  - Evidence: Dossier reçu + numéro de dossier

- [ ] **Garantie Financière APST** → Contrat signé + montant assuré
  - Owner: David + Courtier
  - Deadline: J+15 après Atout France initié
  - Status: ❌ Pending
  - Montant: 15 000€ (minimum légal)
  - Doc: `pdg-eventy/08-assurance-conformite/GARANTIE-FINANCIERE.md`
  - Evidence: Police APST signée

- [ ] **RC Professionnelle** → Couverture dégâts corporels + matériels
  - Owner: David + Assureur
  - Deadline: Avant go-live
  - Status: ❌ Pending
  - Couverture min: 2 000 000€
  - Doc: `pdg-eventy/08-assurance-conformite/RC-PRO.md`
  - Evidence: Attestation d'assurance

---

## 1.3 Conformité Données & Légales

- [ ] **RGPD Conforme** → DPO nommé + Privacy Policy + Consentements
  - Owner: Avocat + DPO
  - Deadline: Avant go-live
  - Status: ❌ Pending
  - Checklist:
    - [ ] DPO désigné (interne ou externe)
    - [ ] Registre CNIL à jour
    - [ ] Privacy Policy visible sur site
    - [ ] Consent banners activés (cookies)
    - [ ] Droit d'accès/suppression implémenté
    - [ ] Export RGPD fonctionnel
  - Doc: `pdg-eventy/01-legal/RGPD-CONFORMITE.md`
  - Evidence: Registre CNIL + Privacy Policy

---

# PHASE 2 — INFRASTRUCTURE 🏗️ [BLOCKING]

## 2.1 Base de Données Production

- [ ] **PostgreSQL Production** → DB isolée, backups 24h, failover
  - Owner: DevOps/Tech Lead
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Configuration:
    - [ ] Instance managed (AWS RDS / Scaleway / OVH)
    - [ ] 20 GB initial capacity, auto-scaling enabled
    - [ ] Backups à J-1, J-7, conservés 30 jours
    - [ ] Encryption at rest
    - [ ] SSL/TLS pour connexions
    - [ ] VPC isolé, access via bastion
  - Doc: `pdg-eventy/04-hebergement-infra/COMPARATIF-CLOUD.md`
  - Evidence: Credentials secured in vault

- [ ] **Migrations Prisma Validées** → Schéma prod = schéma versionné
  - Owner: Backend Lead
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] Toutes migrations testées en environnement mirror
    - [ ] Rollback plan documenté
    - [ ] Zero-downtime migration strategy en place
    - [ ] Historique migrations versionné

- [ ] **Data Seed Production** → Données initiales (ex: destinations, catégories)
  - Owner: Backend Lead
  - Deadline: J-2 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] Seed script vérifié (idempotent)
    - [ ] Test seed sur DB replica avant execution
    - [ ] Rollback script prêt

---

## 2.2 Hébergement & Compute

- [ ] **Backend NestJS Déployé** → Instance prod + load balancer
  - Owner: DevOps
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Configuration:
    - [ ] Docker image build optimisée (multi-stage)
    - [ ] 2+ instances min (HA)
    - [ ] Load balancer + health checks
    - [ ] Auto-scaling policy: CPU > 70%
    - [ ] Cold start < 5s, warm start < 100ms
  - Platform: Vercel / AWS ECS / Scaleway
  - Evidence: Deployment logs + health check passing

- [ ] **Frontend Next.js Déployé** → CDN + edge caching
  - Owner: Frontend Lead
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Configuration:
    - [ ] Next.js build optimisation (images, chunks)
    - [ ] CDN (Vercel / Cloudflare)
    - [ ] Edge Functions (middleware) testé
    - [ ] Cache headers configuré (1h static, revalidate dynamic)
    - [ ] 3 portals deployed (public, pro, admin)
  - Evidence: Performance audit > 90 Lighthouse

- [ ] **.env.production Configuré** → Secrets en vault, pas en git
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Vault: AWS Secrets Manager / HashiCorp Vault / Vercel Env
  - Checklist:
    - [ ] DATABASE_URL (prod)
    - [ ] JWT_SECRET (rotated)
    - [ ] STRIPE_SECRET_KEY (live)
    - [ ] RESEND_API_KEY (live)
    - [ ] S3_BUCKET (prod)
    - [ ] SENTRY_DSN (prod)
    - [ ] NODE_ENV = production
  - Evidence: Vault access log

---

## 2.3 Domaines & Certificats

- [ ] **Domaine Principal Enregistré** → eventy.fr / eventy.life (TBD)
  - Owner: David
  - Deadline: ASAP
  - Status: ❌ Pending
  - Registrar: Gandi / OVH / Namecheap
  - Evidence: Whois + DNS records pointing to production

- [ ] **DNS Records Configurés** → A, CNAME, MX, TXT (DKIM/SPF)
  - Owner: DevOps
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Records:
    - [ ] A → Backend IP / Load Balancer
    - [ ] CNAME www → main domain
    - [ ] MX → Email provider (Resend/Brevo)
    - [ ] SPF → include:sendingdomain.resend.dev
    - [ ] DKIM → Keys from email provider
    - [ ] DMARC → p=quarantine
    - [ ] CAA → allow Let's Encrypt

- [ ] **SSL/TLS Certificate** → Auto-renew via Let's Encrypt / ACM
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Certificate:
    - [ ] Valid for *.eventy.fr + eventy.fr
    - [ ] Auto-renewal configured
    - [ ] HSTS header enabled (Strict-Transport-Security)
    - [ ] TLS 1.2 minimum (1.3 preferred)
  - Evidence: SSL Labs score A+

---

# PHASE 3 — SECURITY 🔐 [BLOCKING]

## 3.1 OWASP Top 10 & Core Security

- [ ] **SQL Injection Prevention** → Prisma ORM + prepared statements validated
  - Owner: Backend Lead
  - Deadline: J-10 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] Code review: no raw SQL queries
    - [ ] Input validation active
    - [ ] Prisma query builder used consistently

- [ ] **XSS Protection** → CSP headers + input sanitization
  - Owner: Frontend Lead + Security
  - Deadline: J-10 avant launch
  - Status: ❌ Pending
  - Headers:
    - [ ] Content-Security-Policy (strict)
    - [ ] X-Content-Type-Options: nosniff
    - [ ] X-Frame-Options: DENY
  - Sanitization:
    - [ ] DOMPurify for user-generated content
    - [ ] React escaping by default

- [ ] **CSRF Protection** → CSRF tokens on state-change forms
  - Owner: Backend + Frontend
  - Deadline: J-10 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] CSRF token generated per session
    - [ ] Token validated on POST/PUT/DELETE
    - [ ] SameSite=Strict on auth cookies

- [ ] **Authentication Security** → Passwords hashed + 2FA for admin
  - Owner: Backend Lead
  - Deadline: J-10 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] bcrypt (rounds ≥ 12) or Argon2
    - [ ] 2FA (TOTP) for admins mandatory
    - [ ] Session timeout (30 min + extend on activity)
    - [ ] Login attempt throttling (5 tries / 15 min)

- [ ] **Access Control Validation** → Role-based + resource ownership
  - Owner: Backend Lead
  - Deadline: J-10 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] @Roles guard on all /admin routes
    - [ ] Users can only access own bookings/travels
    - [ ] Pro users can only edit own travels
    - [ ] Admin endpoints reject non-admins

---

## 3.2 API & Transport Security

- [ ] **Rate Limiting Configured** → DDoS + brute force protection
  - Owner: DevOps + Backend
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Limits:
    - [ ] Auth endpoints: 5 req/min per IP
    - [ ] Public endpoints: 100 req/min per IP
    - [ ] API endpoints: 1000 req/min per user
    - [ ] Redis-backed rate limiter (throttler module)
  - Evidence: Load test with >1000 req/s

- [ ] **CORS Configured Correctly** → Whitelist domains only
  - Owner: Backend Lead
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] CORS_ORIGIN = prod domains only (not *)
    - [ ] Credentials: true for auth requests
    - [ ] Allowed methods: GET, POST, PATCH, DELETE
    - [ ] Preflight caching 1 hour

- [ ] **API Key & Token Rotation** → Monthly rotation + revocation
  - Owner: DevOps
  - Deadline: Monthly audit procedure
  - Status: ❌ Pending
  - Checklist:
    - [ ] JWT secret rotation script ready
    - [ ] Stripe API key rotation documented
    - [ ] Resend API key in vault (not code)
    - [ ] Token expiry: 15 min (accessToken), 7 days (refreshToken)

- [ ] **Secrets Management** → No hardcoded secrets, vault only
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] Vault (AWS Secrets / Vercel Env) setup
    - [ ] Git hooks prevent secret commits
    - [ ] Secret scanning tool (git-secrets / TruffleHog) active
    - [ ] All .env.local in .gitignore
    - [ ] Credential rotation audit quarterly

---

## 3.3 Infrastructure Security

- [ ] **VPC & Firewall** → Isolate DB from public internet
  - Owner: DevOps
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] DB in private subnet only
    - [ ] Backend in private subnet + NAT for outbound
    - [ ] ALB/Load Balancer in public subnet
    - [ ] Security groups: DB accepts only from app layer
    - [ ] No SSH from public internet

- [ ] **WAF & Bot Protection** → CloudFlare / AWS WAF / OVH
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Rules:
    - [ ] WAF active (block known exploits)
    - [ ] Bot detection (Challenge CAPTCHAs)
    - [ ] Rate limiting (HTTP 429)
    - [ ] Geo-blocking (if needed)

---

# PHASE 4 — BACKEND & MIGRATIONS 🛠️ [BLOCKING]

## 4.1 Code & Database Readiness

- [ ] **All Migrations Tested** → Dry-run on replica DB
  - Owner: Backend Lead
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Process:
    - [ ] Create snapshot of prod DB
    - [ ] Run migrations on snapshot
    - [ ] Verify schema + data integrity
    - [ ] Rollback test
    - [ ] Time migration (must be < 5 min)
    - [ ] Document any manual steps

- [ ] **Seed Data Executed** → Initial data for production
  - Owner: Backend Lead
  - Deadline: J-2 avant launch
  - Status: ❌ Pending
  - Data to seed:
    - [ ] Destinations (Paris, Lyon, Nice...)
    - [ ] Default pricing categories
    - [ ] Admin user account
    - [ ] System settings/config
  - Checklist:
    - [ ] Seed script idempotent (safe to run twice)
    - [ ] Test on replica before production

---

## 4.2 Health & Monitoring

- [ ] **Health Check Endpoint Active** → /health responds 200
  - Owner: Backend Lead
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Endpoint: GET /health
  - Response:
    ```json
    {
      "status": "ok",
      "timestamp": "2026-03-19T10:00:00Z",
      "database": "connected",
      "services": {
        "stripe": "ok",
        "email": "ok"
      }
    }
    ```
  - Evidence: Health endpoint responds consistently

- [ ] **Cron Jobs Tested** → Scheduled tasks ready
  - Owner: Backend Lead
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Jobs to verify:
    - [ ] Abandoned cart cleanup (daily)
    - [ ] Revenue reconciliation (weekly)
    - [ ] Overdue payment reminders (daily)
    - [ ] Backup jobs (daily)
  - Checklist:
    - [ ] Each job tested in staging
    - [ ] Error handling + retry logic
    - [ ] Logging configured
    - [ ] Timezone set to Europe/Paris

- [ ] **Logging Configured** → Application logs to centralized service
  - Owner: DevOps
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Logger: Sentry + Winston / ELK / CloudWatch
  - Levels: error, warn, info (debug disabled in production)
  - Checklist:
    - [ ] Request IDs tracked
    - [ ] Sensitive data masked (passwords, tokens)
    - [ ] Log retention: 30 days min

---

# PHASE 5 — FRONTEND & SEO 🎨 [BLOCKING]

## 5.1 Production Build & Optimization

- [ ] **Production Build Verified** → npm run build → .next folder optimized
  - Owner: Frontend Lead
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] Build succeeds with no warnings
    - [ ] Bundle size < 500KB (gzipped)
    - [ ] No console errors / warnings in production
    - [ ] Source maps uploaded to Sentry only
    - [ ] Tree-shaking active (unused imports removed)

- [ ] **Image Optimization** → Next.js Image component used everywhere
  - Owner: Frontend Lead
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] All <img> tags replaced with <Image>
    - [ ] Responsive images (srcSet)
    - [ ] Lazy loading enabled
    - [ ] WebP format offered with fallback
    - [ ] Image CDN configured (Vercel, Cloudflare)
    - [ ] LCP < 2.5s (Lighthouse metric)

---

## 5.2 SEO & Meta Tags

- [ ] **Meta Tags on All Pages** → title, description, og:* tags
  - Owner: Frontend Lead
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Pages to check:
    - [ ] Home page
    - [ ] Destination pages (dynamic)
    - [ ] Travel detail pages (dynamic)
    - [ ] Blog articles (if any)
  - Each page must have:
    - [ ] `<title>` (50-60 chars)
    - [ ] `<meta name="description">` (120-160 chars)
    - [ ] `<meta property="og:image">` (1200x630px min)
    - [ ] `<meta property="og:url">`
    - [ ] Canonical tag

- [ ] **Sitemap Generated** → /sitemap.xml
  - Owner: Frontend Lead
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Configuration:
    - [ ] Generated by next-sitemap or similar
    - [ ] Includes all public pages
    - [ ] Excludes /admin, /pro (robots noindex)
    - [ ] Lastmod date updated
    - [ ] Sitemap index for > 50K URLs
    - [ ] Submitted to Google Search Console

- [ ] **robots.txt Configured** → /robots.txt
  - Owner: Frontend Lead
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Content:
    ```
    User-agent: *
    Allow: /
    Disallow: /admin/
    Disallow: /pro/
    Disallow: /*.json$
    Sitemap: https://eventy.fr/sitemap.xml
    ```

---

## 5.3 Core Web Vitals & Accessibility

- [ ] **Lighthouse Score > 90** → Performance + Accessibility + Best Practices
  - Owner: Frontend Lead
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Metrics:
    - [ ] Performance > 90
    - [ ] Accessibility > 90
    - [ ] Best Practices > 90
    - [ ] SEO > 90
  - Tool: Google PageSpeed Insights / Lighthouse CLI
  - Evidence: Screenshot of report

- [ ] **Responsive Design Tested** → Desktop, Tablet, Mobile
  - Owner: Frontend Lead
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Breakpoints:
    - [ ] 320px (small mobile)
    - [ ] 640px (mobile)
    - [ ] 1024px (tablet)
    - [ ] 1280px (desktop)
  - Test on real devices (iOS Safari, Chrome Android)

- [ ] **Error Boundaries Active** → Catch React errors gracefully
  - Owner: Frontend Lead
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] Global Error Boundary component deployed
    - [ ] 404 page custom designed
    - [ ] 500 error page with support contact
    - [ ] Fallback UI for network errors
    - [ ] Errors logged to Sentry

---

# PHASE 6 — PAYMENTS & WEBHOOKS 💳 [BLOCKING]

## 6.1 Stripe Configuration

- [ ] **Stripe Live Account Created** → Not test mode
  - Owner: Finance / Product Manager
  - Deadline: J-10 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] Live account activated
    - [ ] Company info verified
    - [ ] Bank account connected
    - [ ] Payout schedule configured (daily/weekly)
    - [ ] Fee structure documented

- [ ] **Live API Keys in Production** → STRIPE_SECRET_KEY & STRIPE_PUBLISHABLE_KEY
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] Keys in vault only (not in code)
    - [ ] Restricted API keys used (IP whitelisting)
    - [ ] Key rotation plan documented

---

## 6.2 Payment Flow Validation

- [ ] **Webhook Endpoints Configured** → Stripe → Backend
  - Owner: Backend Lead
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Events to handle:
    - [ ] payment_intent.succeeded
    - [ ] payment_intent.payment_failed
    - [ ] charge.refunded
    - [ ] customer.deleted
    - [ ] invoice.payment_succeeded
  - Checklist:
    - [ ] Endpoint registered in Stripe dashboard
    - [ ] Signing secret configured
    - [ ] Webhook signature verification active
    - [ ] Idempotent event processing (no double-charge)
    - [ ] Retry logic for failed webhooks

- [ ] **Test Payment Successful** → Full booking → Payment → Success
  - Owner: QA / Product Manager
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Steps:
    - [ ] Create booking
    - [ ] Initiate payment (card: 4242 4242 4242 4242)
    - [ ] Verify payment_intent.succeeded
    - [ ] Verify booking marked CONFIRMED
    - [ ] Verify confirmation email sent
    - [ ] Verify Stripe dashboard shows charge
  - Evidence: Screenshot of Stripe transaction

- [ ] **Refund Process Tested** → Request refund → Stripe processed → Email sent
  - Owner: QA / Product Manager
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Steps:
    - [ ] Create completed booking
    - [ ] Request refund via admin dashboard
    - [ ] Verify refund initiated in Stripe
    - [ ] Verify refund webhook processed
    - [ ] Verify booking status = REFUNDED
    - [ ] Verify refund confirmation email
  - Evidence: Stripe refund ID + booking status

- [ ] **3D Secure / SCA Tested** → High-value card requires verification
  - Owner: QA / Backend Lead
  - Deadline: J-2 avant launch
  - Status: ❌ Pending
  - Test card: 4000 0025 0000 3155 (requires SCA)
  - Checklist:
    - [ ] Payment flow redirects to verification
    - [ ] Verification completes successfully
    - [ ] Webhook confirms payment
    - [ ] Booking confirmed

---

# PHASE 7 — EMAIL & COMMUNICATIONS 📧

## 7.1 Email Provider Setup

- [ ] **Resend / Brevo Account Created** → Live account, not testing
  - Owner: Marketing / Product
  - Deadline: J-10 avant launch
  - Status: ❌ Pending
  - Configuration:
    - [ ] Account created + verified
    - [ ] Sending domain configured (eventy.fr)
    - [ ] SPF record added to DNS
    - [ ] DKIM keys generated + added to DNS
    - [ ] DMARC policy configured (p=quarantine)
    - [ ] API key in vault

---

## 7.2 Email Templates & Verification

- [ ] **Email Templates Tested** → All 15+ templates send + render
  - Owner: Marketing + Frontend
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Templates:
    - [ ] Welcome email
    - [ ] Booking confirmation
    - [ ] Payment confirmation
    - [ ] Booking cancellation
    - [ ] Password reset
    - [ ] Invoice
    - [ ] Refund notification
    - [ ] Contact form response
  - Checklist:
    - [ ] HTML rendering correct (test in Outlook, Gmail, Apple Mail)
    - [ ] Images load correctly
    - [ ] Links are correct
    - [ ] No broken layouts on mobile

- [ ] **SPF / DKIM / DMARC Verified** → Email authentication
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Tools: MXToolbox, Google Admin Toolbox
  - Checklist:
    - [ ] SPF passes (no softfail)
    - [ ] DKIM passes
    - [ ] DMARC policy active (p=quarantine or p=reject)
    - [ ] DMARC reports received (optional)
    - [ ] Email deliverability > 95% (test with Mail-tester)

---

## 7.3 Opt-out & Unsubscribe

- [ ] **Unsubscribe Link Functional** → All emails include footer link
  - Owner: Marketing + Backend
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] Unsubscribe link in footer of every email
    - [ ] Link points to preference center
    - [ ] User can unsubscribe with single click (GDPR)
    - [ ] Unsubscribe processed within 24h
    - [ ] No further marketing emails sent

---

# PHASE 8 — PERFORMANCE & LOAD TESTING 📊

## 8.1 Load Testing

- [ ] **K6 Load Test Executed** → 1000+ concurrent users
  - Owner: DevOps
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Test scenarios:
    - [ ] Homepage load (100 users)
    - [ ] Travel search (500 users)
    - [ ] Booking flow (200 users, 5 min ramp-up)
    - [ ] Payment processing (50 concurrent payments)
  - Success criteria:
    - [ ] Response time p95 < 500ms
    - [ ] Error rate < 0.1%
    - [ ] No timeout errors
    - [ ] Database CPU < 80%
  - Tool: k6 / Apache JMeter / Locust
  - Evidence: Report with graphs

- [ ] **Database Query Performance** → Slow query log reviewed
  - Owner: Backend Lead
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Checklist:
    - [ ] No N+1 queries (use Prisma include/select)
    - [ ] Indexes on foreign keys + frequently filtered columns
    - [ ] Query execution time < 100ms for most
    - [ ] EXPLAIN ANALYZE on critical queries
    - [ ] Connection pooling configured

---

## 8.2 Caching Strategy

- [ ] **Browser Cache Headers Set** → Leverage CDN/browser caching
  - Owner: Frontend Lead
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Headers:
    - [ ] Static assets: Cache-Control: max-age=31536000 (1 year)
    - [ ] HTML pages: Cache-Control: max-age=3600 (1 hour, revalidate)
    - [ ] API responses: Cache-Control: no-cache (validate with ETags)
    - [ ] User-specific data: Cache-Control: private, no-store

- [ ] **Redis Cache Configured** → Session + API response caching
  - Owner: DevOps + Backend
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Use cases:
    - [ ] Session storage (vs in-memory)
    - [ ] Travel listing cache (1h TTL)
    - [ ] Destination images cache (24h TTL)
    - [ ] Rate limiter state
  - Checklist:
    - [ ] Redis cluster (2+ nodes)
    - [ ] Eviction policy: allkeys-lru
    - [ ] Persistence: AOF enabled
    - [ ] Backup strategy documented

---

# PHASE 9 — MONITORING & OBSERVABILITY 👀

## 9.1 Centralized Monitoring

- [ ] **Sentry Configured** → Error tracking + performance monitoring
  - Owner: DevOps
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Configuration:
    - [ ] Project created (backend + frontend separate)
    - [ ] DSN in vault
    - [ ] Release tracking enabled
    - [ ] Sourcemaps uploaded (frontend)
    - [ ] Sensitive data filtering (PII redaction)
    - [ ] Alert on new error types
  - Evidence: Dashboard accessible + test error logged

- [ ] **Uptime Monitoring** → Ping /health every 5 min
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Tool: UptimeRobot / Checkly / StatusCake
  - Configuration:
    - [ ] Endpoint: GET https://api.eventy.fr/health
    - [ ] Interval: 5 minutes
    - [ ] Alert if down > 5 min
    - [ ] Incident page (status.eventy.fr)
    - [ ] Auto-tweet status on incidents (optional)

---

## 9.2 Application Metrics & Alerts

- [ ] **CloudWatch / Datadog Metrics** → CPU, Memory, Disk, Requests
  - Owner: DevOps
  - Deadline: J-7 avant launch
  - Status: ❌ Pending
  - Metrics to track:
    - [ ] Backend CPU usage (alarm > 80%)
    - [ ] Backend memory usage (alarm > 90%)
    - [ ] Database CPU usage (alarm > 75%)
    - [ ] Database connections (alarm > 90% of max)
    - [ ] Request latency p95 (alarm > 500ms)
    - [ ] Error rate (alarm > 0.1%)
    - [ ] Payment success rate (alarm < 98%)
    - [ ] Webhook processing lag (alarm > 30s)

- [ ] **Email Alerts Configured** → Critical issues → on-call engineer
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Recipients:
    - [ ] DevOps team (primary)
    - [ ] Backend lead (secondary)
    - [ ] CEO (critical only)
  - Alert channels:
    - [ ] Email for all alerts
    - [ ] Slack for critical only
    - [ ] SMS for P0 incidents (optional)

- [ ] **Slack Integration Active** → Errors, deploys, KPIs
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Channels:
    - [ ] #alerts-critical (P0/P1)
    - [ ] #alerts-warnings (P2/P3)
    - [ ] #deployments (all deploys logged)
    - [ ] #revenue (daily KPI snapshot)

---

## 9.3 Database Backup & Recovery

- [ ] **Automated Backups** → Daily snapshots, 30-day retention
  - Owner: DevOps
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Configuration:
    - [ ] Daily backup at 2 AM UTC (off-peak)
    - [ ] Weekly full backup
    - [ ] Monthly backup archived to S3
    - [ ] Retention: 30 days hot, 1 year cold
    - [ ] Backup logs monitored (alert if failed)

- [ ] **Disaster Recovery Plan** → RTO < 1h, RPO < 15 min
  - Owner: DevOps + CEO
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Plan must document:
    - [ ] Backup restoration procedure (tested quarterly)
    - [ ] RTO target: < 1 hour
    - [ ] RPO target: < 15 minutes
    - [ ] Data loss tolerance: < 1K records
    - [ ] Failover to replica DB (if applicable)
    - [ ] Contact list for incident response
  - Evidence: Plan document + test execution log

---

# PHASE 10 — POST-LAUNCH SUPPORT 🚀

## 10.1 Go-Live Day Readiness

- [ ] **Incident Response Plan** → Escalation + communication
  - Owner: CEO + DevOps
  - Deadline: J-1 avant launch
  - Status: ❌ Pending
  - Plan includes:
    - [ ] On-call rotation (24/7 for first week)
    - [ ] Escalation path (dev → tech lead → CEO)
    - [ ] Communication template (status page + Twitter)
    - [ ] Rollback procedure (if needed)
    - [ ] Known issues list + workarounds

- [ ] **Launch Day Checklist** → Final pre-flight checks
  - Owner: CEO + Tech Lead
  - Deadline: 24h before launch
  - Status: ❌ Pending
  - Items:
    - [ ] All systems passing health checks
    - [ ] Load testing passed
    - [ ] Monitoring alerts armed
    - [ ] On-call team briefed
    - [ ] Comms team ready (Twitter, email, support)
    - [ ] Database backups recent (< 1h old)
    - [ ] No pending migrations
    - [ ] Feature flags tested (kill switch ready)

---

## 10.2 Analytics & User Feedback

- [ ] **Google Analytics 4 Deployed** → Conversion tracking active
  - Owner: Marketing
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Configuration:
    - [ ] GA4 property created
    - [ ] gtag script in <head> of all pages
    - [ ] Event tracking: signup, booking, payment
    - [ ] Conversion goals set (booking_created, payment_completed)
    - [ ] Audience segments configured
    - [ ] Dashboard created (daily active users, conversion funnel)

- [ ] **Hotjar Session Recording** → User behavior analysis
  - Owner: Product Manager
  - Deadline: J-5 avant launch
  - Status: ❌ Pending
  - Configuration:
    - [ ] Hotjar tracking code deployed
    - [ ] Session recording enabled (sample 10% of sessions)
    - [ ] Heatmaps enabled (10 top pages)
    - [ ] Feedback widget added (non-intrusive)
    - [ ] GDPR consent respected

- [ ] **Support Channel Open** → Email + Chat available
  - Owner: Marketing + CEO
  - Deadline: Launch day
  - Status: ❌ Pending
  - Channels:
    - [ ] Email: support@eventy.fr
    - [ ] Chat widget on site (Intercom / Zendesk)
    - [ ] Response time SLA: < 4h business hours
    - [ ] FAQ page updated with go-live info

---

## 10.3 Post-Launch Verification (First 7 Days)

- [ ] **Daily Monitoring Checkpoint** → Error rate, payment success, user signups
  - Owner: DevOps + Product Manager
  - Frequency: Daily at 10 AM + 4 PM (first 7 days)
  - Status: ❌ Pending
  - Checklist (each day):
    - [ ] Error rate < 0.1%
    - [ ] Payment success rate > 98%
    - [ ] API latency p95 < 500ms
    - [ ] Zero critical Sentry errors
    - [ ] User signup rate tracking (monitor for anomalies)
    - [ ] Email delivery rate > 95%
    - [ ] No abandoned carts > 1000

- [ ] **Weekly KPI Review** → Revenue, bookings, user retention
  - Owner: CEO + Product Manager
  - Frequency: Every Monday (first month)
  - Status: ❌ Pending
  - KPIs to review:
    - [ ] Total signups (target: 100+)
    - [ ] Total bookings (target: 20+)
    - [ ] Conversion rate (signup → booking)
    - [ ] Average order value
    - [ ] Customer acquisition cost (estimate)
    - [ ] Churn rate (users inactive > 7 days)
    - [ ] Support ticket volume

---

## 10.4 Documentation & Handoff

- [ ] **Runbooks Written** → How to handle common incidents
  - Owner: DevOps + Backend Lead
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Runbooks for:
    - [ ] Database down → Failover to replica
    - [ ] Payment processor down → Queue payments, retry
    - [ ] Email service down → Alert support team
    - [ ] Memory leak → Restart backend pod
    - [ ] High error rate → Check recent deploy, rollback if needed
    - [ ] DDoS attack → Activate WAF rules, contact provider

- [ ] **On-Call Documentation** → Team knows how to debug
  - Owner: Tech Lead
  - Deadline: J-3 avant launch
  - Status: ❌ Pending
  - Includes:
    - [ ] Architecture diagram (frontend/backend/DB)
    - [ ] Key endpoints documented (/health, /admin/stats, etc.)
    - [ ] Common error codes + solutions
    - [ ] How to access logs (Sentry, CloudWatch)
    - [ ] How to access database (bastion host setup)
    - [ ] Deployment rollback procedure

---

# SIGN-OFF & DEPLOYMENT

## Final Approval

| Role | Name | Date | Sign |
|------|------|------|------|
| CEO / Founder | David | — | ☐ |
| Tech Lead | — | — | ☐ |
| Finance/Legal | — | — | ☐ |

## Deployment Execution

- [ ] **GO/NO-GO Decision** → CEO approves launch
  - Owner: David
  - Status: ❌ Pending
  - Go criteria:
    - All P0/P1 items ✅
    - All P0 risk mitigated
    - Team briefed + on-call ready
    - Rollback plan validated

- [ ] **Deployment Button Pressed** → Production deploy starts
  - Owner: Tech Lead (with CEO watching)
  - Status: ❌ Pending
  - Duration: ~30 min (zero-downtime)
  - Monitoring: All dashboards watched in real-time

- [ ] **Launch Announcement** → Twitter + Email to waitlist
  - Owner: CEO + Marketing
  - Status: ❌ Pending
  - Timing: Immediately after deployment confirmed
  - Content: Brief announcement + link + call to action

---

**Last Updated**: 2026-03-19
**Next Review**: When status changes significantly or weekly

---

## Quick Reference Links

- Architecture: `/mnt/eventisite/backend/ARCHITECTURE.md`
- Finance: `/mnt/eventisite/pdg-eventy/02-finance/`
- Legal: `/mnt/eventisite/pdg-eventy/01-legal/`
- Marketing: `/mnt/eventisite/pdg-eventy/07-marketing-commercial/`
- Operations: `/mnt/eventisite/pdg-eventy/10-operations/`
