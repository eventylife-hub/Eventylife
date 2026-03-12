'use client';

import { useState } from 'react';

/**
 * Composant - Formulaire de feedback post-voyage
 * Permet au client de laisser ses impressions avec notes par catégorie et commentaire
 */
interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export interface FeedbackFormData {
  overallRating: number;
  transportRating: number;
  accommodationRating: number;
  organizationRating: number;
  guidanceRating: number;
  comment: string;
}

export function FeedbackForm({
  onSubmit,
  isSubmitting = false,
  onCancel,
}: FeedbackFormProps) {
  const [overallRating, setOverallRating] = useState(5);
  const [transportRating, setTransportRating] = useState(5);
  const [accommodationRating, setAccommodationRating] = useState(5);
  const [organizationRating, setOrganizationRating] = useState(5);
  const [guidanceRating, setGuidanceRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      overallRating,
      transportRating,
      accommodationRating,
      organizationRating,
      guidanceRating,
      comment,
    });
  };

  const RatingStars = ({
    rating,
    onChange,
    label,
  }: {
    rating: number;
    onChange: (value: number) => void;
    label: string;
  }) => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          {label}
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`w-10 h-10 rounded-lg font-bold transition ${
                star <= rating
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-yellow-200'
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-3 text-gray-700 font-medium">{rating}/5</span>
        </div>
      </div>
    );
  };

  return (
    <form aria-label="Formulaire de retour" onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Vos Impressions</h2>

      {/* Note globale */}
      <RatingStars
        rating={overallRating}
        onChange={setOverallRating}
        label="Note Globale"
      />

      {/* Notes par catégorie */}
      <div className="border-t pt-6 mt-6">
        <h3 className="font-bold text-gray-900 mb-6">Détails par Catégorie</h3>

        <RatingStars
          rating={transportRating}
          onChange={setTransportRating}
          label="Transport & Déplacement"
        />
        <RatingStars
          rating={accommodationRating}
          onChange={setAccommodationRating}
          label="Hébergement"
        />
        <RatingStars
          rating={organizationRating}
          onChange={setOrganizationRating}
          label="Organisation & Logistique"
        />
        <RatingStars
          rating={guidanceRating}
          onChange={setGuidanceRating}
          label="Accompagnement & Guides"
        />
      </div>

      {/* Commentaire */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Votre Commentaire
        </label>
        <textarea
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder="Partagez vos impressions, ce que vous avez aimé, ce qui pourrait être amélioré..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/1000 caractères
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : '✓ Envoyer mon avis'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
