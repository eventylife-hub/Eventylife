# Email Template Variables Reference

**Last Updated:** 2026-03-18

This document lists all variable placeholders used in Eventy Life email templates.

---

## Global Variables (Available in All Templates)

These variables should be available in every template:

| Variable | Type | Example | Purpose |
|----------|------|---------|---------|
| `{{UNSUBSCRIBE_URL}}` | URL | https://eventylife.com/unsubscribe?token=xyz | Footer unsubscribe link |
| `{{PRIVACY_POLICY_URL}}` | URL | https://eventylife.com/privacy | Footer privacy policy link |
| `{{LEGAL_NOTICE_URL}}` | URL | https://eventylife.com/legal | Footer legal notices link |

---

## User-Specific Variables

| Variable | Template | Type | Example | Purpose |
|----------|----------|------|---------|---------|
| `{{FIRST_NAME}}` | All welcome/account emails | String | "Marie" | User's first name for personalization |
| `{{LAST_NAME}}` | Account emails | String | "Dupont" | User's last name |
| `{{EMAIL}}` | Account verification | String | "marie@example.com" | User email address |
| `{{USER_ID}}` | All | String | "usr_12345abc" | Unique user identifier |

---

## Email Verification Template (`email-verification.html`)

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `{{FIRST_NAME}}` | String | Yes | "Jean" |
| `{{VERIFICATION_URL}}` | URL | Yes | "https://eventylife.com/verify?token=abc123" |

**Expiry:** 24 hours

---

## Welcome Email Template (`bienvenue-voyageur.html`)

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `{{FIRST_NAME}}` | String | Yes | "Sophie" |
| `{{DISCOVER_VOYAGES_URL}}` | URL | Yes | "https://app.eventylife.com/voyages" |
| `{{VOYAGE_1_NAME}}` | String | No | "Weekend à Barcelone" |
| `{{VOYAGE_1_DESCRIPTION}}` | String | No | "3 jours entre plages et gastronomie" |
| `{{VOYAGE_1_PRICE}}` | Number | No | "299" |
| `{{VOYAGE_2_NAME}}` | String | No | "Semaine en Provence" |
| `{{VOYAGE_2_DESCRIPTION}}` | String | No | "7 jours de détente et culture" |
| `{{VOYAGE_2_PRICE}}` | Number | No | "599" |

**Notes:** Featured voyage cards can be dynamically populated or left empty for generic welcome

---

## Password Reset Template (`password-reset.html`)

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `{{RESET_URL}}` | URL | Yes | "https://eventylife.com/reset?token=xyz789" |

**Expiry:** 1 hour
**Security:** Should be single-use token

---

## Post-Travel Feedback Template (`satisfaction-voyage.html`)

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `{{FIRST_NAME}}` | String | Yes | "Luc" |
| `{{TRAVEL_NAME}}` | String | Yes | "Roadtrip Côte d'Azur" |
| `{{TRAVEL_DATE}}` | String | Yes | "du 15 au 22 mai 2026" |
| `{{FEEDBACK_URL}}` | URL | Yes | "https://eventylife.com/feedback/survey123" |
| `{{TRAVELER_COUNT}}` | Number | No | "12" |

---

## Travel Cancellation Template (`annulation-confirmation.html`)

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `{{FIRST_NAME}}` | String | Yes | "Pierre" |
| `{{TRAVEL_NAME}}` | String | Yes | "Randonnée Alpes" |
| `{{TRAVEL_DATE}}` | String | Yes | "25-29 juin 2026" |
| `{{CANCELLATION_DATE}}` | String | Yes | "18 mars 2026" |
| `{{CANCELLATION_REASON}}` | String | No | "Nombre minimum de participants non atteint" |

---

## Travel Canceled Refund Template (`travel-canceled-refund.html`)

| Variable | Type | Required | Example | Notes |
|----------|------|----------|---------|-------|
| `{{FIRST_NAME}}` | String | Yes | "Mathieu" | User's first name |
| `{{TRAVEL_NAME}}` | String | Yes | "Croisière Méditerranée" | Full travel name |
| `{{TRAVEL_DATE}}` | String | Yes | "10-17 juillet 2026" | Travel dates |
| `{{REFUND_AMOUNT}}` | Number | Yes | "1250" | Amount in EUR (without currency) |
| `{{REFUND_METHOD}}` | String | Yes | "Virement bancaire" | How refund will be delivered |
| `{{REFUND_TIMELINE}}` | String | Yes | "5-7 jours ouvrables" | Expected timeline |
| `{{ALTERNATIVE_1_NAME}}` | String | No | "Circuit Espagne" | Alternative travel name |
| `{{ALTERNATIVE_1_DESCRIPTION}}` | String | No | "Découvrez la culture espagnole" | Short description |
| `{{ALTERNATIVE_1_PRICE}}` | Number | No | "899" | Price per person |
| `{{ALTERNATIVE_2_NAME}}` | String | No | "Séjour Portugal" | Second alternative |
| `{{ALTERNATIVE_2_DESCRIPTION}}` | String | No | "Plages et patrimoine" | Description |
| `{{ALTERNATIVE_2_PRICE}}` | Number | No | "749" | Price per person |
| `{{EXPLORE_TRAVELS_URL}}` | URL | Yes | "https://app.eventylife.com/voyages" | Link to other travels |

---

## Travel No-Go Refund Template (`travel-nogo-refund.html`)

| Variable | Type | Required | Example | Notes |
|----------|------|----------|---------|-------|
| `{{FIRST_NAME}}` | String | Yes | "Anne" | User's first name |
| `{{TRAVEL_NAME}}` | String | Yes | "Escapade Pyrénées" | Full travel name |
| `{{TRAVEL_DATE}}` | String | Yes | "15-18 août 2026" | Travel dates |
| `{{REFUND_AMOUNT}}` | Number | Yes | "450" | Amount in EUR (without currency) |
| `{{REFUND_METHOD}}` | String | Yes | "Crédit de voyage" | Refund method |
| `{{REFUND_TIMELINE}}` | String | Yes | "Immédiat" | Timeline |
| `{{ALTERNATIVE_1_NAME}}` | String | No | "Safari Tanzanie" | Alternative travel |
| `{{ALTERNATIVE_1_DESCRIPTION}}` | String | No | "Aventure en Afrique" | Description |
| `{{ALTERNATIVE_1_PRICE}}` | Number | No | "2499" | Price per person |
| `{{ALTERNATIVE_2_NAME}}` | String | No | "Île Maurice" | Second alternative |
| `{{ALTERNATIVE_2_DESCRIPTION}}` | String | No | "Détente tropicale" | Description |
| `{{ALTERNATIVE_2_PRICE}}` | Number | No | "1899" | Price per person |
| `{{EXPLORE_TRAVELS_URL}}` | URL | Yes | "https://app.eventylife.com/voyages" | Link to confirmed travels |

---

## Not Yet Referenced Templates

### Pro Welcome Email (`bienvenue-pro.html`)
Variables to be defined when integrated

### Booking Confirmation (`confirmation-reservation.html`)
Variables to be defined when integrated

### Travel Quote (`devis-voyage.html`)
Variables to be defined when integrated

### Travel Documents (`documents-voyage.html`)
Variables to be defined when integrated

### Payment Reminder (`rappel-solde.html`)
Variables to be defined when integrated

---

## Implementation Guidelines

### Variable Substitution

1. **Required Variables:** Must always be provided, email should not send without them
2. **Optional Variables:** Can be empty/null; template should handle gracefully
3. **Format:** Use `{{VARIABLE_NAME}}` (double curly braces)
4. **Escaping:** HTML-escape user-provided data to prevent XSS

### Variable Types

- **String:** Text content, names, descriptions — should be HTML-escaped
- **Number:** Prices, amounts, quantities — no decimal points unless needed
- **URL:** Links — must be fully-formed HTTPS URLs
- **Date:** Should be human-readable, localized to French

### Best Practices

1. Always provide a fallback or conditional for optional variables
2. Test email rendering with real data before deployment
3. Monitor email delivery and bounce rates
4. Update this reference when adding new templates
5. Use consistent naming conventions (SCREAMING_SNAKE_CASE)

---

## Testing Variables

For development/staging, use these test values:

```
FIRST_NAME=Claude
LAST_NAME=Eventy
EMAIL=test@eventylife.com
VERIFICATION_URL=https://staging.eventylife.com/verify?token=TEST_TOKEN_12345
RESET_URL=https://staging.eventylife.com/reset?token=TEST_TOKEN_12345
TRAVEL_NAME=Test Travel Name
REFUND_AMOUNT=1000
REFUND_METHOD=Virement bancaire
REFUND_TIMELINE=5-7 jours ouvrables
EXPLORE_TRAVELS_URL=https://app.eventylife.com/voyages
```

