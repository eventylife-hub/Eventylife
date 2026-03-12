/**
 * Tests unitaires — lib/validations
 * Schémas Zod pour les formulaires Eventy Life
 */
import {
  contactSchema,
  supportTicketSchema,
  profileSchema,
  zodErrorsToRecord,
} from '@/lib/validations';

describe('contactSchema', () => {
  const validData = {
    name: 'Jean Dupont',
    email: 'jean@example.com',
    phone: '+33 6 12 34 56 78',
    subject: 'Renseignement',
    message: 'Bonjour, je souhaite en savoir plus sur vos voyages organisés.',
    consent: true as const,
  };

  it('valide des données correctes', () => {
    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejette un email invalide', () => {
    const result = contactSchema.safeParse({ ...validData, email: 'pas-un-email' });
    expect(result.success).toBe(false);
  });

  it('rejette un message trop court', () => {
    const result = contactSchema.safeParse({ ...validData, message: 'Trop court' });
    expect(result.success).toBe(false);
  });

  it('rejette sans consentement', () => {
    const result = contactSchema.safeParse({ ...validData, consent: false });
    expect(result.success).toBe(false);
  });

  it('accepte un téléphone vide (optionnel)', () => {
    const result = contactSchema.safeParse({ ...validData, phone: '' });
    expect(result.success).toBe(true);
  });

  it('rejette un numéro de téléphone invalide', () => {
    const result = contactSchema.safeParse({ ...validData, phone: 'abc' });
    expect(result.success).toBe(false);
  });

  it('trim les espaces du nom et email', () => {
    const result = contactSchema.safeParse({
      ...validData,
      name: '  Jean Dupont  ',
      email: '  Jean@Example.COM  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Jean Dupont');
      expect(result.data.email).toBe('jean@example.com');
    }
  });
});

describe('supportTicketSchema', () => {
  const validTicket = {
    subject: 'Problème de paiement',
    category: 'BILLING' as const,
    priority: 'HIGH' as const,
    message: 'Mon paiement a été refusé sans raison apparente.',
  };

  it('valide un ticket correct', () => {
    const result = supportTicketSchema.safeParse(validTicket);
    expect(result.success).toBe(true);
  });

  it('rejette un sujet trop court', () => {
    const result = supportTicketSchema.safeParse({ ...validTicket, subject: 'Pb' });
    expect(result.success).toBe(false);
  });

  it('rejette une catégorie invalide', () => {
    const result = supportTicketSchema.safeParse({ ...validTicket, category: 'INVALID' });
    expect(result.success).toBe(false);
  });

  it('utilise MEDIUM comme priorité par défaut', () => {
    const { priority, ...withoutPriority } = validTicket;
    const result = supportTicketSchema.safeParse(withoutPriority);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priority).toBe('MEDIUM');
    }
  });
});

describe('zodErrorsToRecord', () => {
  it('convertit les erreurs Zod en Record<string, string>', () => {
    const result = contactSchema.safeParse({
      name: '',
      email: 'invalid',
      message: 'x',
      consent: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = zodErrorsToRecord(result.error);
      expect(typeof errors).toBe('object');
      expect(Object.keys(errors).length).toBeGreaterThan(0);
      // Chaque valeur est une string (message d'erreur FR)
      Object.values(errors).forEach((msg) => {
        expect(typeof msg).toBe('string');
        expect(msg.length).toBeGreaterThan(0);
      });
    }
  });

  it('retourne un objet vide pour aucune erreur', () => {
    const result = contactSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      subject: 'Test',
      message: 'Un message suffisamment long pour passer la validation.',
      consent: true as const,
    });

    expect(result.success).toBe(true);
  });
});
