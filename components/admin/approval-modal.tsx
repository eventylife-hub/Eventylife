'use client';

import React, { useState } from 'react';

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
      <div className="w-full max-w-md bg-white rounded-xl border shadow-sm">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold">Décision pour {entityName}</h2>
        </div>
        <div className="p-6 space-y-6">
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
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px]"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              className={`px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] ${action === 'reject' ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
              onClick={handleSubmit}
              disabled={isSubmitting || (action === 'reject' && !reason.trim())}
            >
              {isSubmitting ? 'Traitement...' : action === 'approve' ? 'Approuver' : 'Rejeter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
