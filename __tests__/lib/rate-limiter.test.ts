/**
 * Tests unitaires — lib/rate-limiter.ts
 * Rate limiter côté client pour protection anti-spam
 */
import { RateLimiter, formSubmitLimiter, apiCallLimiter } from '@/lib/rate-limiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('autorise la première requête', () => {
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 1 });
    expect(limiter.canProceed('test')).toBe(true);
  });

  it('bloque après avoir atteint la limite', () => {
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 2 });
    limiter.record('test');
    limiter.record('test');
    expect(limiter.canProceed('test')).toBe(false);
  });

  it('réautorise après expiration de la fenêtre', () => {
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 1 });
    limiter.record('test');
    expect(limiter.canProceed('test')).toBe(false);

    jest.advanceTimersByTime(1001);
    expect(limiter.canProceed('test')).toBe(true);
  });

  it('isole les clés différentes', () => {
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 1 });
    limiter.record('cle-a');
    expect(limiter.canProceed('cle-a')).toBe(false);
    expect(limiter.canProceed('cle-b')).toBe(true);
  });

  it('tryProceed enregistre et bloque en une opération', () => {
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 1 });
    expect(limiter.tryProceed('submit')).toBe(true);
    expect(limiter.tryProceed('submit')).toBe(false);
  });

  it('reset efface le compteur pour une clé', () => {
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 1 });
    limiter.record('test');
    expect(limiter.canProceed('test')).toBe(false);

    limiter.reset('test');
    expect(limiter.canProceed('test')).toBe(true);
  });

  it('clear efface tout le limiter', () => {
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 1 });
    limiter.record('a');
    limiter.record('b');

    limiter.clear();
    expect(limiter.canProceed('a')).toBe(true);
    expect(limiter.canProceed('b')).toBe(true);
  });

  it('gère plusieurs requêtes dans la fenêtre', () => {
    const limiter = new RateLimiter({ windowMs: 1000, maxRequests: 3 });
    expect(limiter.tryProceed('api')).toBe(true);
    expect(limiter.tryProceed('api')).toBe(true);
    expect(limiter.tryProceed('api')).toBe(true);
    expect(limiter.tryProceed('api')).toBe(false);
  });
});

describe('instances globales', () => {
  it('formSubmitLimiter existe et est un RateLimiter', () => {
    expect(formSubmitLimiter).toBeInstanceOf(RateLimiter);
  });

  it('apiCallLimiter existe et est un RateLimiter', () => {
    expect(apiCallLimiter).toBeInstanceOf(RateLimiter);
  });
});
