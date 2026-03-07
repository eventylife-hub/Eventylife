import { useState, useCallback } from 'react';

interface UploadProgress {
  [key: string]: number;
}

interface UploadError {
  [key: string]: string;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({});
  const [errors, setErrors] = useState<UploadError>({});

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const uploadId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      setUploading(true);

      // 1. Obtenir l'URL de présignage
      const presignResponse = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
      });

      if (!presignResponse.ok) {
        throw new Error('Erreur lors de la génération de l\'URL de présignage');
      }

      const { uploadUrl, assetId } = await presignResponse.json();

      // 2. Télécharger vers S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      // Mettre à jour la progression
      setProgress((prev) => ({ ...prev, [uploadId]: 100 }));

      // 3. Confirmer le téléchargement
      const confirmResponse = await fetch(`/api/uploads/${assetId}/confirm`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!confirmResponse.ok) {
        throw new Error('Erreur lors de la confirmation du téléchargement');
      }

      // Retourner l'ID de l'asset
      return assetId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setErrors((prev) => ({ ...prev, [uploadId]: message }));
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  const clearProgress = useCallback((uploadId: string) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[uploadId];
      return newProgress;
    });
  }, []);

  const clearError = useCallback((uploadId: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[uploadId];
      return newErrors;
    });
  }, []);

  const clearAll = useCallback(() => {
    setProgress({});
    setErrors({});
  }, []);

  return {
    uploading,
    progress,
    errors,
    uploadFile,
    clearProgress,
    clearError,
    clearAll,
  };
}
