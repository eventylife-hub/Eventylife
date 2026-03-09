'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface UserDetail {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  adminRoles?: string[];
  avatarUrl?: string;
  isActive: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  proProfile?: {
    id: string;
    status: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    createdAt: string;
  };
}

/**
 * Page de détail d'un utilisateur
 * - Affiche les informations complètes de l'utilisateur
 * - Permet d'activer/désactiver le compte
 * - Affiche le profil Pro si existant
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const fetchUser = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 404) {
        setError('Utilisateur non trouvé');
      } else if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors du chargement de l\'utilisateur');
      }
    } catch {
      setError('Impossible de charger l\'utilisateur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      setToggling(true);
      setError(null);
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (response.ok) {
        setUser({ ...user, isActive: !user.isActive });
        // In production: show toast: "Statut mis à jour avec succès"
      } else if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors de la mise à jour du statut');
      }
    } catch {
      setError('Impossible de mettre à jour le statut. Vérifiez votre connexion.');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-fade-in space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Profil utilisateur
          </h1>
        </div>
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="admin-fade-in space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Profil utilisateur
          </h1>
        </div>
        <Link href="/admin/utilisateurs">
          <button className="admin-btn-secondary gap-2 flex items-center text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </Link>
        <div className="admin-panel">
          <div className="admin-panel-body p-8 text-center">
            <p className="text-gray-600 font-medium mb-4">{error}</p>
            <button onClick={fetchUser} className="admin-btn-secondary">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-fade-in space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Profil utilisateur
          </h1>
        </div>
        <Link href="/admin/utilisateurs">
          <button className="admin-btn-secondary gap-2 flex items-center text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </Link>
        <div className="text-center py-12">
          <p className="text-gray-600">Utilisateur non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-fade-in space-y-6">
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Profil utilisateur
        </h1>
      </div>

      {/* Bouton retour */}
      <div className="admin-fade-in delay-1">
        <Link href="/admin/utilisateurs">
          <button className="admin-btn-secondary gap-2 flex items-center text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </Link>
      </div>

      {/* Affichage erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 admin-fade-in delay-2">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Infos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 admin-fade-in delay-2">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">Informations personnelles</h3>
          </div>
          <div className="admin-panel-body space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Téléphone</p>
              <p className="font-medium">{user.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rôle</p>
              <p className="font-medium">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <p className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {user.isActive ? 'Actif' : 'Inactif'}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">Dates importantes</h3>
          </div>
          <div className="admin-panel-body space-y-4">
            <div>
              <p className="text-sm text-gray-600">Inscrit le</p>
              <p className="font-medium">
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dernière connexion</p>
              <p className="font-medium">
                {user.lastLoginAt
                  ? formatDate(user.lastLoginAt)
                  : 'Jamais'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email vérifié</p>
              <p className="font-medium">
                {user.emailVerifiedAt ? 'Oui' : 'Non'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="admin-panel admin-fade-in delay-3">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Actions</h3>
        </div>
        <div className="admin-panel-body flex gap-4">
          <button
            onClick={handleToggleStatus}
            disabled={toggling}
            className={`${user.isActive ? 'admin-btn-destructive' : 'admin-btn-primary'} gap-2 flex items-center`}
          >
            {toggling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Traitement...
              </>
            ) : (
              user.isActive ? 'Désactiver l\'utilisateur' : 'Réactiver l\'utilisateur'
            )}
          </button>
          <p className="text-sm text-gray-600 flex items-center">
            {user.isActive
              ? 'Cet utilisateur peut accéder à la plateforme'
              : 'Cet utilisateur ne peut pas accéder à la plateforme'
            }
          </p>
        </div>
      </div>

      {/* Profil Pro */}
      {user.proProfile && (
        <div className="admin-panel admin-fade-in delay-4">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">Profil Pro</h3>
          </div>
          <div className="admin-panel-body space-y-4">
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.proProfile.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entreprise</p>
              <p className="font-medium">{user.proProfile.company || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Créé le</p>
              <p className="font-medium">
                {formatDate(user.proProfile.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
