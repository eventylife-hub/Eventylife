'use client';

import React, { useState, useCallback } from 'react';
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  FileIcon,
  Loader,
} from 'lucide-react';

interface FileUploadProps {
  accept?: string[];
  maxSize?: number; // in bytes
  onUpload: (assetId: string) => void;
  label?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function FileUpload({
  accept = [],
  maxSize = 10 * 1024 * 1024, // 10MB default
  onUpload,
  label = 'Déposer des fichiers ou cliquer pour en sélectionner',
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `Fichier trop volumineux (max ${Math.round(maxSize / 1024 / 1024)}MB)`;
    }

    if (accept.length > 0) {
      const mimeType = file.type;
      const fileName = file.name;
      const extension = `.${fileName.split('.').pop()}`;

      const isAccepted = accept.some(
        (type) =>
          type === mimeType ||
          type === extension ||
          type === '*/*' ||
          type.endsWith('/*')
      );

      if (!isAccepted) {
        return 'Type de fichier non accepté';
      }
    }

    return null;
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const validFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (!file) continue;

      const error = validateFile(file);

      if (error) {
        validFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'error',
          error,
        });
      } else {
        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'pending',
        };
        validFiles.push(uploadedFile);
        uploadFile(file, uploadedFile.id);
      }
    }

    setFiles([...files, ...validFiles]);
  };

  const uploadFile = async (file: File, fileId: string) => {
    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: 'uploading' as const } : f
        )
      );

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
        throw new Error('Erreur lors de la génération de l\'URL de téléchargement');
      }

      const { uploadUrl, assetId } = await presignResponse.json() as unknown;

      // 2. Télécharger directement en S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      // 3. Confirmer le téléchargement
      const confirmResponse = await fetch(`/api/uploads/${assetId}/confirm`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!confirmResponse.ok) {
        throw new Error('Erreur lors de la confirmation du téléchargement');
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: 'success' as const, progress: 100 } : f
        )
      );

      // Appeler le callback avec l'ID du fichier
      onUpload(assetId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: 'error' as const, error: message } : f
        )
      );
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <div className="space-y-4">
      {/* Zone de dépôt */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          accept={accept.join(',')}
          onChange={handleInputChange}
          aria-label={label}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            {maxSize && (
              <p className="text-xs text-gray-500">
                Max {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <FileIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>

              {file.status === 'pending' && (
                <div className="text-xs text-gray-500">En attente</div>
              )}

              {file.status === 'uploading' && (
                <Loader className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
              )}

              {file.status === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}

              {file.status === 'error' && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  {file.error && (
                    <span className="text-xs text-red-500">{file.error}</span>
                  )}
                </div>
              )}

              {file.status !== 'uploading' && (
                <button type="button"
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                  aria-label="Supprimer le fichier"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
