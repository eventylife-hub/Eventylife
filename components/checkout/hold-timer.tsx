/**
 * Composant timer d'expiration du hold
 * Compte à rebours depuis holdExpiresAt
 * - Normal jusqu'à 5 minutes restantes (gris)
 * - Alerte à < 5 minutes (orange)
 * - Critique à < 1 minute (rouge, pulsing)
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface HoldTimerProps {
  expiresAt: Date;
}

export function HoldTimer({ expiresAt }: HoldTimerProps) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [status, setStatus] = useState<'normal' | 'alert' | 'critical'>('normal');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const expireTime = new Date(expiresAt).getTime();
      const diff = Math.max(0, expireTime - now);

      setRemaining(diff);

      if (diff === 0) {
        setStatus('critical');
      } else if (diff < 60000) {
        // < 1 minute
        setStatus('critical');
      } else if (diff < 300000) {
        // < 5 minutes
        setStatus('alert');
      } else {
        setStatus('normal');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (remaining === null) {
    return null;
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  if (remaining === 0) {
    return (
      <div className="flex items-center gap-2 text-red-600 font-semibold">
        <AlertCircle className="w-4 h-4" />
        Hold expiré
      </div>
    );
  }

  const colors = {
    normal: 'text-gray-600',
    alert: 'text-orange-600',
    critical: 'text-red-600 animate-pulse',
  };

  return (
    <div className={`flex items-center gap-1 ${colors[status]} font-medium text-sm`}>
      <Clock className="w-4 h-4" />
      <span>
        {minutes}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
