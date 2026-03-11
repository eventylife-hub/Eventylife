'use client';

import React from 'react';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadProgressProps {
  filename: string;
  progress: number; // 0-100
  isComplete: boolean;
  isError: boolean;
  error?: string;
  onCancel?: () => void;
}

export function UploadProgress({
  filename,
  progress,
  isComplete,
  isError,
  error,
  onCancel,
}: UploadProgressProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {isError ? (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          ) : isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <Upload className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          )}

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {filename}
            </h4>

            {!isError && !isComplete && (
              <div className="mt-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs text-gray-500">
                    Téléchargement en cours
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {isComplete && (
              <p className="text-xs text-green-600 font-medium mt-1">
                Téléchargement réussi
              </p>
            )}

            {isError && (
              <p className="text-xs text-red-600 font-medium mt-1">
                {error || 'Une erreur s\'est produite'}
              </p>
            )}
          </div>
        </div>

        {!isComplete && onCancel && (
          <button type="button"
            onClick={onCancel}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Annuler"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
