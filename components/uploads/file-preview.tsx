'use client';

import React from 'react';
import {
  FileText,
  File,
  Download,
  Trash2,
  Image as ImageIcon,
  Play,
} from 'lucide-react';

interface FilePreviewProps {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url?: string;
  onDelete?: (id: string) => void | Promise<void>;
  isDeleting?: boolean;
}

export function FilePreview({
  id,
  filename,
  mimeType,
  sizeBytes,
  url,
  onDelete,
  isDeleting = false,
}: FilePreviewProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = (mime: string) => {
    if (mime.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    if (mime === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (mime.startsWith('video/')) {
      return <Play className="h-8 w-8 text-purple-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const getPreview = () => {
    if (mimeType.startsWith('image/') && url) {
      return (
        <img
          src={url}
          alt={filename}
          className="w-full h-full object-cover"
        />
      );
    }
    if (mimeType.startsWith('video/') && url) {
      return (
        <video
          src={url}
          className="w-full h-full object-cover"
          controls
        />
      );
    }
    return (
      <div className="flex items-center justify-center bg-gray-100 h-full">
        {getIcon(mimeType)}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Aperçu */}
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {getPreview()}
      </div>

      {/* Informations */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
          {filename}
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          {formatSize(sizeBytes)}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          {url && (
            <a
              href={url}
              download={filename}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </a>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              disabled={isDeleting}
              className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
              aria-label="Supprimer le fichier"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
