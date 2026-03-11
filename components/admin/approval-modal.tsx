'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ApprovalModalProps {
  isOpen: boolean;
  entityName: string;
  onClose: () => void;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  loading?: boolean;
}

/**
 * Modal d'approbation/rejet réutilisable
 */
export function ApprovalModal({
  isOpen,
  entityName,
  onClose,
  onApprove,
  onReject,
  loading = false,
}: ApprovalModalProps) {
  const [action, setAction] = useState<'approve' | 'reject'>('approve');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (action === 'approve') {
        await onApprove();
      } else {
        if (!reason.trim()) {
          alert('Veuillez fournir une raison pour le rejet');
          return;
        }
        await onReject(reason);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-lg font-semibold">Décision pour {entityName}</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="action"
                value="approve"
                checked={action === 'approve'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAction((e.target as HTMLInputElement).value as 'approve' | 'reject')}
                disabled={isSubmitting}
              />
              <span className="text-sm font-medium">Approuver</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="action"
                value="reject"
                checked={action === 'reject'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAction((e.target as HTMLInputElement).value as 'approve' | 'reject')}
                disabled={isSubmitting}
              />
              <span className="text-sm font-medium">Rejeter</span>
            </label>
          </div>

          {/* Reason Textarea */}
          {action === 'reject' && (
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium">
                Raison du rejet (requis)
              </label>
              <textarea
                id="reason"
                className="w-full h-24 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez la raison du rejet..."
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason((e.target as HTMLInputElement).value)}
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (action === 'reject' && !reason.trim())}
              className={action === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {isSubmitting ? 'Traitement...' : action === 'approve' ? 'Approuver' : 'Rejeter'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
