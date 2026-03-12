/**
 * Tests unitaires — lib/api-error.ts
 * Normalisation des erreurs API et utilitaire de retry
 */
import { normalizeApiError, withRetry, type ApiError } from '@/lib/api-error';

describe('normalizeApiError', () => {
  it('normalise une erreur réseau (TypeError)', () => {
    const error = new TypeError('Failed to fetch');
    const result = normalizeApiError(error);

    expect(result.message).toContain('réseau');
    expect(result.status).toBe(0);
    expect(result.retryable).toBe(true);
  });

  it('normalise une erreur de timeout (AbortError)', () => {
    const error = new DOMException('Aborted', 'AbortError');
    const result = normalizeApiError(error);

    expect(result.message).toContain('temps');
    expect(result.retryable).toBe(true);
  });

  it('normalise une réponse 401', () => {
    const response = new Response(null, { status: 401 });
    const result = normalizeApiError(response);

    expect(result.status).toBe(401);
    expect(result.message).toContain('session');
    expect(result.retryable).toBe(false);
  });

  it('normalise une réponse 404', () => {
    const response = new Response(null, { status: 404 });
    const result = normalizeApiError(response);

    expect(result.status).toBe(404);
    expect(result.message).toContain('trouvé');
    expect(result.retryable).toBe(false);
  });

  it('normalise une réponse 500 comme retryable', () => {
    const response = new Response(null, { status: 500 });
    const result = normalizeApiError(response);

    expect(result.status).toBe(500);
    expect(result.retryable).toBe(true);
  });

  it('normalise une réponse 429 comme retryable', () => {
    const response = new Response(null, { status: 429 });
    const result = normalizeApiError(response);

    expect(result.status).toBe(429);
    expect(result.retryable).toBe(true);
  });

  it('ajoute le contexte au message', () => {
    const error = new TypeError('Failed to fetch');
    const result = normalizeApiError(error, 'Chargement des voyages');

    expect(result.context).toBe('Chargement des voyages');
  });

  it('gère un Error générique', () => {
    const error = new Error('Quelque chose a échoué');
    const result = normalizeApiError(error);

    expect(result.message).toBe('Quelque chose a échoué');
    expect(result.retryable).toBe(false);
  });

  it('gère une valeur inconnue', () => {
    const result = normalizeApiError('string error');

    expect(result.message).toContain('inattendue');
    expect(result.retryable).toBe(false);
  });
});

describe('withRetry', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('retourne le résultat si la fonction réussit au 1er essai', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await withRetry(fn);

    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('relance après un échec puis réussit', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValue('ok');

    const promise = withRetry(fn, 2, 10);
    // Advance timers for retry delay
    jest.advanceTimersByTime(20);
    const result = await promise;

    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('échoue après le nombre max de tentatives', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'));

    await expect(withRetry(fn, 2, 10)).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
  });
});
