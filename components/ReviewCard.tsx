'use client';

interface ReviewCardProps {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status?: string;
  onReport?: (reviewId: string) => void;
}

export function ReviewCard({
  id,
  userName,
  rating,
  comment,
  createdAt,
  status,
  onReport,
}: ReviewCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star: unknown) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-900">{userName}</h3>
          <div className="mt-1">{renderStars(rating)}</div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">{formatDate(createdAt)}</p>
          {status && status !== 'APPROVED' && (
            <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
              En modération
            </span>
          )}
        </div>
      </div>
      <p className="text-slate-700 mb-4">{comment}</p>
      {onReport && (
        <button
          onClick={() => onReport(id)}
          className="text-xs text-red-600 hover:text-red-700 font-semibold"
        >
          Signaler cet avis
        </button>
      )}
    </div>
  );
}
