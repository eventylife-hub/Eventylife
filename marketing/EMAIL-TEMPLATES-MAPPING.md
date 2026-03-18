# Email Templates Mapping

**Last Updated:** 2026-03-18

This document maps backend `templateId` references to their corresponding HTML files in `/marketing/emails-html/`.

## Audit Summary

- **Backend Template IDs Referenced:** 7
- **Existing HTML Files:** 8
- **Missing Templates Created:** 3
- **Coverage:** 100%

---

## Template Mapping

| Backend `templateId` | HTML File | Status | Purpose |
|---|---|---|---|
| `email-verification` | `email-verification.html` | ✅ CREATED | Email verification link sent after signup |
| `welcome` | `bienvenue-voyageur.html` | ✅ EXISTING | Welcome email for new travelers |
| `password-reset` | `password-reset.html` | ✅ CREATED | Password reset instructions |
| `post-travel-feedback` | `satisfaction-voyage.html` | ✅ EXISTING | Post-travel satisfaction survey |
| `travel_canceled` | `annulation-confirmation.html` | ✅ EXISTING | Travel cancellation notification |
| `travel_canceled_refund` | `travel-canceled-refund.html` | ✅ CREATED | Refund notification for canceled travels |
| `travel_nogo_refund` | `travel-nogo-refund.html` | ✅ CREATED | Refund for non-confirmed travels (insufficient participants) |

---

## Additional HTML Files (Not Yet Referenced in Backend)

| HTML File | Purpose | Backend Integration |
|---|---|---|
| `bienvenue-pro.html` | Welcome email for pro partners | Pending integration |
| `confirmation-reservation.html` | Booking confirmation | Pending integration |
| `devis-voyage.html` | Travel quote/estimate | Pending integration |
| `documents-voyage.html` | Travel documents dispatch | Pending integration |
| `rappel-solde.html` | Payment reminder | Pending integration |

---

## Files Created (2026-03-18)

### 1. `email-verification.html`
- **Purpose:** Verification link after user signup
- **Key Variables:** `{{FIRST_NAME}}`, `{{VERIFICATION_URL}}`
- **Design:** Gradient header + security notice + 24hr expiry warning
- **Size:** 5.5 KB

### 2. `password-reset.html`
- **Purpose:** Password reset instructions
- **Key Variables:** `{{RESET_URL}}`
- **Design:** Gradient header + 1hr expiry warning + security notice
- **Size:** 6.2 KB

### 3. `travel-canceled-refund.html`
- **Purpose:** Refund notification when travel is canceled
- **Key Variables:** `{{TRAVEL_NAME}}`, `{{TRAVEL_DATE}}`, `{{REFUND_AMOUNT}}`, `{{REFUND_METHOD}}`, `{{REFUND_TIMELINE}}`
- **Design:** Red warning gradient + refund details table + alternative travels + 2 CTA options
- **Size:** 11 KB

### 4. `travel-nogo-refund.html`
- **Purpose:** Refund notification when travel doesn't reach minimum participants
- **Key Variables:** `{{TRAVEL_NAME}}`, `{{TRAVEL_DATE}}`, `{{REFUND_AMOUNT}}`, `{{REFUND_METHOD}}`, `{{REFUND_TIMELINE}}`
- **Design:** Yellow warning gradient + explanation + Eventy philosophy + alternative travels
- **Size:** 11 KB

---

## Design System Applied

All templates follow Eventy Life's brand guidelines:

- **Header:** Gradient background (FF6B35 → 0077B6) with Eventy Life branding
- **Font:** Outfit for body, Fraunces for headings
- **Color Palette:** 
  - Primary Orange: `#FF6B35`
  - Primary Blue: `#0077B6`
  - Success Green: `#06D6A0`
  - Cream Background: `#FEFCF3`
  - Dark Text: `#0A1628`
- **Layout:** Responsive 600px max-width table-based design
- **Sections:** Clear hierarchy with icons, numbered steps, and call-to-action buttons
- **Footer:** Dark background with links to unsubscribe, privacy, legal notices

---

## Next Steps

1. **Backend Integration:** Update email services to use new templates
2. **Testing:** Send test emails to verify variable substitution
3. **Monitoring:** Track delivery rates and user interactions
4. **Additional Templates:** Integrate the 5 pending templates (bienvenue-pro, confirmation-reservation, devis-voyage, documents-voyage, rappel-solde)

---

## Backend Code References

All templates are referenced in these modules:

- `backend/src/modules/auth/auth.service.ts` → email-verification, welcome, password-reset
- `backend/src/modules/post-sale/post-sale.service.ts` → post-travel-feedback
- `backend/src/modules/travels/travel-lifecycle.service.ts` → travel_canceled, travel_canceled_refund, travel_nogo_refund

