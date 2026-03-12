/**
 * Rate Limiter côté client — Eventy Life
 *
 * Protège contre les soumissions multiples accidentelles
 * (double-click, spam de bouton, erreurs UX).
 *
 * Deux utilitaires :
 * - `RateLimiter` : classe pour limiter les appels par clé
 * - `useThrottle` : hook React pour throttler une action dans un composant
 *
 * NOTE : Ceci est une protection UX côté client uniquement.
 *        Le backend DOIT implémenter son propre rate limiting (idempotency keys).
 */

/**
 * Rate limiter en mémoire basé sur des fenêtres de temps
 *
 * @example
 * ```ts
 * const limiter = new RateLimiter({ windowMs: 2000, maxRequests: 1 });
 *
 * if (!limiter.canProceed('submit-feedback')) {
 *   toast.error('Veuillez patienter avant de réessayer.');
 *   return;
 * }
 *
 * limiter.record('submit-feedback');
 * await submitFeedback(data);
 * ```
 */
export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private hits: Map<string, number[]> = new Map();

  constructor(opts: { windowMs: number; maxRequests: number }) {
    this.windowMs = opts.windowMs;
    this.maxRequests = opts.maxRequests;
  }

  /** Nettoie les entrées expirées pour une clé */
  private prune(key: string): number[] {
    const now = Date.now();
    const timestamps = (this.hits.get(key) ?? []).filter(
      (ts) => now - ts < this.windowMs,
    );
    this.hits.set(key, timestamps);
    return timestamps;
  }

  /** Vérifie si une action est autorisée sans l'enregistrer */
  canProceed(key: string): boolean {
    const timestamps = this.prune(key);
    return timestamps.length < this.maxRequests;
  }

  /** Enregistre un hit pour la clé donnée */
  record(key: string): void {
    const timestamps = this.prune(key);
    timestamps.push(Date.now());
    this.hits.set(key, timestamps);
  }

  /**
   * Vérifie ET enregistre en une seule opération.
   * Retourne `true` si l'action est autorisée, `false` si rate-limitée.
   */
  tryProceed(key: string): boolean {
    if (!this.canProceed(key)) return false;
    this.record(key);
    return true;
  }

  /** Réinitialise le compteur pour une clé */
  reset(key: string): void {
    this.hits.delete(key);
  }

  /** Réinitialise tout le limiter */
  clear(): void {
    this.hits.clear();
  }
}

/**
 * Instance globale pour les soumissions de formulaire
 * 1 requête max par 2 secondes par action
 */
export const formSubmitLimiter = new RateLimiter({
  windowMs: 2_000,
  maxRequests: 1,
});

/**
 * Instance globale pour les appels API génériques
 * 5 requêtes max par seconde par endpoint
 */
export const apiCallLimiter = new RateLimiter({
  windowMs: 1_000,
  maxRequests: 5,
});
