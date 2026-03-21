# Stripe Webhooks — Deployment Checklist

**Date**: 2026-03-20
**Version**: Phase 2 Complete
**Status**: Ready for testing → Production

---

## Pre-Deployment Validation

### Code Review
- [ ] WebhookController — tous les 12 handlers implémentés
- [ ] Tous les handlers utilisent transactions atomiques
- [ ] Tous les handlers gèrent les erreurs (try/catch, jamais throw)
- [ ] Idempotence vérifiée (StripeEvent.create avec unique constraint)
- [ ] INVARIANT 3 appliqué (montants en centimes, jamais Float)
- [ ] INVARIANT 4 appliqué (idempotence complète)
- [ ] INVARIANT 5 appliqué (lock post-paiement dans checkout.session.completed)
- [ ] Logging présent (info, warn, error par handler)
- [ ] ConfigService utilisé pour ADMIN_ALERT_EMAIL (pas hardcoded)

### Database Schema
- [ ] StripeEvent table existe avec champs: stripeEventId, type, rawPayload, processedAt, status, retryCount
- [ ] PaymentContribution enum PaymentStatus inclut: PENDING, SUCCEEDED, FAILED, REFUNDED, DISPUTED
- [ ] BookingGroup enum BookingStatus inclut: DRAFT, HELD, PARTIALLY_PAID, CONFIRMED, CANCELED, EXPIRED
- [ ] RoomBooking table inclut: bookingLockedAt, lockedByUserId
- [ ] User table inclut: stripeConnectId, stripeConnectVerified, stripeCustomerId, isActive

### Email Templates
- [ ] Template `payment-received` existe (client)
- [ ] Template `payment-failed` existe (client)
- [ ] Template `payment-refunded` existe (client)
- [ ] Template `booking-confirmation` existe (client)
- [ ] Template `admin-dispute-alert` existe (admin)
- [ ] Template `admin-dispute-lost` existe (admin)
- [ ] Template `admin-payout-failed-alert` existe (admin)
- [ ] Template `admin-subscription-deleted` existe (admin)
- [ ] Template `admin-monitoring-alert` existe (admin)

### Environment Variables
- [ ] `ADMIN_ALERT_EMAIL` configuré dans .env (ex: admin@eventy.life)
- [ ] `STRIPE_WEBHOOK_SECRET` configuré dans .env (depuis Stripe dashboard)
- [ ] `STRIPE_API_KEY` configuré dans .env (secret key Stripe)

### Stripe Configuration
- [ ] Stripe account créé et authentifié
- [ ] Test mode activé pour tests
- [ ] Webhook endpoint créé dans Stripe dashboard
- [ ] URL: `https://{domain}/payments/webhook`
- [ ] Events à activer:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
  - [ ] `checkout.session.completed`
  - [ ] `checkout.session.expired`
  - [ ] `charge.refunded`
  - [ ] `charge.dispute.created`
  - [ ] `charge.dispute.closed`
  - [ ] `invoice.paid`
  - [ ] `invoice.payment_failed`
  - [ ] `payout.paid`
  - [ ] `payout.failed`
  - [ ] `account.updated`
  - [ ] `customer.subscription.deleted`

---

## Local Testing

### 1. Stripe CLI Setup
```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# ou équivalent pour Linux/Windows

# Authentifier
stripe login

# Forward webhook events vers local
stripe listen --forward-to localhost:3000/payments/webhook
```

### 2. Test Each Webhook
```bash
# payment_intent.succeeded
stripe trigger payment_intent.succeeded

# payment_intent.payment_failed
stripe trigger payment_intent.payment_failed

# checkout.session.completed
stripe trigger checkout.session.completed

# charge.refunded
stripe trigger charge.refunded

# charge.dispute.created
stripe trigger charge.dispute.created

# charge.dispute.closed (WON)
stripe trigger charge.dispute.closed

# invoice.paid
stripe trigger invoice.paid

# payout.paid
stripe trigger payout.paid

# payout.failed
stripe trigger payout.failed

# account.updated
stripe trigger account.updated

# customer.subscription.deleted
stripe trigger customer.subscription.deleted
```

### 3. Local Verification
```bash
# Vérifier que les logs s'affichent
npm run dev  # Backend

# Logs attendus:
# [WebhookController] Événement webhook reçu: payment_intent.succeeded (evt_...)
# [WebhookController] Paiement intent réussi: pi_... — montant: 50000 centimes
```

### 4. Database Verification
```sql
-- Vérifier que StripeEvent a été créé
SELECT * FROM StripeEvent ORDER BY processedAt DESC LIMIT 1;

-- Vérifier que PaymentContribution a été mise à jour
SELECT id, status, paidAt FROM PaymentContribution WHERE status = 'SUCCEEDED' LIMIT 1;

-- Vérifier que RoomBooking a été lockée
SELECT id, bookingLockedAt, lockedByUserId FROM RoomBooking WHERE bookingLockedAt IS NOT NULL LIMIT 1;
```

---

## Staging Testing

### 1. Deploy to Staging
```bash
cd /path/to/eventisite/backend
npm run build
npm run start:prod
```

### 2. Configure Staging Webhook
- [ ] Create webhook endpoint in Stripe dashboard (test mode)
- [ ] URL: `https://staging.eventy.life/payments/webhook`
- [ ] Copy WEBHOOK_SECRET to staging .env

### 3. Run Integration Tests
```bash
npm run test:e2e
```

### 4. Simulate Real Scenario
1. Create booking in staging
2. Initiate payment (Stripe test card)
3. Complete checkout
4. Verify:
   - [ ] StripeEvent created
   - [ ] PaymentContribution marked SUCCEEDED
   - [ ] BookingGroup marked CONFIRMED
   - [ ] RoomBookings locked
   - [ ] Email sent to customer
   - [ ] No errors in logs

### 5. Test Failure Scenarios
```bash
# Test payment failure
stripe trigger payment_intent.payment_failed

# Verify:
# - PaymentContribution marked FAILED
# - Email sent to customer with retry link
```

```bash
# Test dispute
stripe trigger charge.dispute.created

# Verify:
# - PaymentContribution marked FAILED
# - Email sent to admin
# - Logs show ERROR level
```

```bash
# Test payout failure
stripe trigger payout.failed

# Verify:
# - Admin email sent immediately
# - Logs show ERROR level
```

---

## Production Deployment

### 1. Pre-Deployment Checklist
- [ ] All tests passing (unit + integration + e2e)
- [ ] Code review approved
- [ ] Database migration deployed
- [ ] Email templates validated
- [ ] Environment variables set
- [ ] Stripe webhook configured in live mode
- [ ] Monitoring/alerting configured
- [ ] Rollback plan documented

### 2. Deploy
```bash
# Build
npm run build

# Push to production
git push origin main  # CI/CD pipeline handles deployment
```

### 3. Post-Deployment Verification
```bash
# Verify webhook in Stripe dashboard (live mode)
# - Events being received
# - Successful deliveries > 95%

# Monitor logs
tail -f /var/log/eventy/backend.log | grep WEBHOOK

# Verify database
SELECT COUNT(*) FROM StripeEvent WHERE status = 'SUCCESS';  -- Should increase
SELECT COUNT(*) FROM StripeEvent WHERE status = 'FAILED';   -- Should be small
```

### 4. First 24h Monitoring
- [ ] No webhook errors in logs
- [ ] All events processed successfully
- [ ] Admin alerts for critical issues (disputes, payouts failed)
- [ ] Emails sent correctly
- [ ] Database transactions atomic

---

## Monitoring & Alerting

### 1. Configure Logging
```typescript
// .env
LOG_LEVEL=debug  // En prod: info
WEBHOOK_DEBUG=false  // En test: true, en prod: false
```

### 2. Setup Monitoring (Sentry, DataDog, etc.)
```typescript
// Capture webhook errors
Sentry.captureException(error, {
  tags: { webhook_type: event.type },
});
```

### 3. Alert Rules
| Event | Severity | Action |
|-------|----------|--------|
| charge.dispute.created | CRITICAL | Page on-call |
| payout.failed | CRITICAL | Page on-call |
| Webhook failed (3+ retries) | HIGH | Email admin |
| invoice.payment_failed | MEDIUM | Email admin |
| account.updated (charges_disabled) | MEDIUM | Email admin |

### 4. CRON Job — Monitor Failed Webhooks
```typescript
@Cron('*/5 * * * *')  // Every 5 minutes
async monitorFailedWebhooks() {
  const failedEvents = await this.prisma.stripeEvent.findMany({
    where: { status: 'FAILED', processedAt: null },
  });

  if (failedEvents.length > 0) {
    // Alert admin
    await emailService.queueEmail(
      'admin@eventy.life',
      `⚠️ ${failedEvents.length} webhooks failed — manual review required`,
      'admin-webhook-monitoring',
      { count: failedEvents.length, events: failedEvents }
    );
  }
}
```

---

## Rollback Plan

### If Webhooks Broken
1. **Immediate**: Disable webhook endpoint in Stripe dashboard
2. **Prevent**: Stop accepting new payments
3. **Recover**: Replay failed events manually using Stripe CLI
4. **Fix**: Roll back WebhookController to previous version
5. **Redeploy**: Test in staging, redeploy to production
6. **Verify**: All failed webhooks reprocessed

### Rollback Command
```bash
# Revert to previous version
git revert <commit-hash>
git push origin main  # CI/CD redeploys

# Manually replay failed events
stripe events resend evt_failed_id  # Si disponible via API
```

---

## Success Criteria

✅ **Phase 1 — Development**
- [x] All 12 handlers implemented
- [x] Unit tests template created
- [x] Documentation complete
- [x] Code review ready

✅ **Phase 2 — Staging Testing**
- [ ] All webhooks tested via Stripe CLI
- [ ] Integration tests passing
- [ ] No database errors
- [ ] Emails sent correctly
- [ ] Logs clean (no warnings/errors)

✅ **Phase 3 — Production**
- [ ] Webhook endpoint live in production
- [ ] First 24h without incidents
- [ ] Monitoring alerts working
- [ ] Admin notifications received
- [ ] Customer confirmations sent

---

## Key Contacts

| Role | Name | Email | Slack |
|------|------|-------|-------|
| PDG | David | eventylife@gmail.com | @david |
| Backend Lead | — | — | — |
| DevOps | — | — | — |
| Finance | — | — | — |

---

## Useful Links

- [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Eventy Repo](file:///sessions/zealous-compassionate-lovelace/mnt/eventisite)
- [WebhookController](file:///sessions/zealous-compassionate-lovelace/mnt/eventisite/backend/src/modules/payments/webhook.controller.ts)
- [WEBHOOKS-STRIPE-COMPLETION.md](file:///sessions/zealous-compassionate-lovelace/mnt/eventisite/WEBHOOKS-STRIPE-COMPLETION.md)

---

## Sign-off

- [ ] Backend Developer — Code review approved
- [ ] QA Engineer — Tests passing
- [ ] DevOps Engineer — Infrastructure ready
- [ ] PDG David — Business approval

---

**Last Updated**: 2026-03-20
**Next Review**: After first week in production
