'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Users,
  Briefcase,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
/**
 * Page: Pro Voyage Équipe (/pro/voyages/[id]/equipe)
 * 
 * Gestion de l'équipe d'un voyage:
 * - Liste membres assignés: nom, rôle, statut, date assignation
 * - Bouton inviter → modal avec email et sélection rôle
 * - Bouton supprimer membre (avec confirmation)
 * - Checklist: préalables de l'équipe avant lancement
 * 
 * API:
 * - GET /api/pro/travels/${id}/team
 * - POST /api/pro/travels/${id}/team/invite
 * - DELETE /api/pro/travels/${id}/team/:memberId
 */

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'CREATOR' | 'INDEPENDANT' | 'VENDEUR';
  status: 'INVITED' | 'ACCEPTED' | 'DECLINED';
  assignedDate: string;
  acceptedDate?: string;
}

interface TeamPrerequisite {
  id: string;
  label: string;
  completed: boolean;
  dueDate?: string;
}

const ROLE_COLORS: Record<string, string> = {
  CREATOR: 'bg-indigo-100 text-indigo-800',
  INDEPENDANT: 'bg-blue-100 text-blue-800',
  VENDEUR: 'bg-emerald-100 text-emerald-800',
};

const ROLE_LABELS: Record<string, string> = {
  CREATOR: 'Créateur',
  INDEPENDANT: 'Indépendant',
  VENDEUR: 'Vendeur',
};

const STATUS_COLORS: Record<string, string> = {
  INVITED: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  INVITED: 'Invité',
  ACCEPTED: 'Accepté',
  DECLINED: 'Refusé',
};

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  INVITED: Clock,
  ACCEPTED: CheckCircle2,
  DECLINED: XCircle,
};

const PREREQUISITES = [
  { label: 'Documents signés par tous les membres', required: true },
  { label: 'Assurance voyage complète', required: true },
  { label: 'Formation sécurité validée', required: true },
  { label: 'Coordonnées bancaires confirmées', required: true },
];

export default function EquipePage() {
  const params = useParams();
  const travelId = params.id as string;

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [prerequisites, setPrerequisites] = useState<TeamPrerequisite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'CREATOR' | 'INDEPENDANT' | 'VENDEUR'>('VENDEUR');
  const [inviting, setInviting] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirming, setDeleteConfirming] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/pro/travels/${travelId}/team`, { credentials: 'include' });

        if (!res.ok) throw new Error('Erreur chargement équipe');

        const data = (await res.json() as unknown) as unknown;
        setTeam(data.team || []);
        setPrerequisites(data.prerequisites || []);
        setError(null);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (travelId) {
      fetchTeam();
    }
  }, [travelId]);

  const handleInvite = async () => {
    if (!inviteEmail) {
      setError('Veuillez entrer une adresse email');
      return;
    }

    try {
      setInviting(true);
      const res = await fetch(`/api/pro/travels/${travelId}/team/invite`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (!res.ok) throw new Error('Erreur invitation');

      const newMember = (await res.json() as unknown) as unknown;
      setTeam([...team, newMember]);
      setInviteEmail('');
      setInviteRole('VENDEUR');
      setShowInviteModal(false);
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      setDeletingId(memberId);
      const res = await fetch(`/api/pro/travels/${travelId}/team/${memberId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur suppression');

      setTeam(team.filter((m) => m.id !== memberId));
      setDeleteConfirming(null);
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
    <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628' }}>Équipe du voyage</h1>
          <p style={{ color: '#4A5568', marginTop: '0.5rem' }}>Gérez les membres et les préalables</p>
        </div>
        <button onClick={() => setShowInviteModal(true)} className="pro-btn-sun" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus className="w-4 h-4" />
          Inviter un membre
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{ padding: '1.5rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--pro-coral)', flexShrink: 0 }} />
          <p style={{ color: 'var(--pro-coral)', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="pro-panel" style={{ border: '2px solid #0077B6' }}>
          <div className="pro-panel-header">
            <h3 className="pro-panel-title">Inviter un membre</h3>
          </div>
          <div className="pro-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Email</label>
              <input
                type="email"
                autoComplete="email"
                value={inviteEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteEmail((e.target as HTMLInputElement).value)}
                placeholder="pro@example.com"
                className="pro-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Rôle</label>
              <select
                value={inviteRole}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteRole((e.target as HTMLInputElement).value as 'CREATOR' | 'INDEPENDANT' | 'VENDEUR')}
                className="pro-input"
                style={{ width: '100%' }}
              >
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleInvite} disabled={inviting} className="pro-btn-sun">
                {inviting ? 'Invitation...' : 'Inviter'}
              </button>
              <button onClick={() => setShowInviteModal(false)} className="pro-btn-outline">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="pro-panel">
        <div className="pro-panel-header">
          <h3 className="pro-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users className="w-5 h-5" />
            Membres de l'équipe
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#8896A6', margin: 0 }}>{team.length} membre(s)</p>
        </div>
        <div className="pro-panel-body">
          {team.length > 0 ? (
            <div className="space-y-2">
              {team.map((member) => {
                const StatusIcon = STATUS_ICONS[member.status];
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <p className="font-medium text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[member.role]}`}>
                          {ROLE_LABELS[member.role]}
                        </span>
                        <div className="flex items-center gap-1">
                          {(() => {
                            const StatusIcon = STATUS_ICONS[member.status];
                            return StatusIcon ? <StatusIcon className="w-3 h-3" /> : null;
                          })()}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[member.status]}`}>
                            {STATUS_LABELS[member.status]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Assigné le {formatDate(member.assignedDate)}
                        </p>
                      </div>
                    </div>

                    {deleteConfirming === member.id ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRemove(member.id)}
                          disabled={deletingId === member.id}
                          size="sm"
                          variant="destructive"
                        >
                          Confirmer
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirming(null)}
                          size="sm"
                          variant="outline"
                        >
                          Annuler
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setDeleteConfirming(member.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        aria-label="Supprimer le membre"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucun membre invité pour le moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Prerequisites Checklist */}
      <div className="pro-panel">
        <div className="pro-panel-header">
          <h3 className="pro-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase className="w-5 h-5" />
            Préalables avant lancement
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#8896A6', margin: 0 }}>Éléments à valider avant la publication</p>
        </div>
        <div className="pro-panel-body">
          <div className="space-y-3">
            {PREREQUISITES.map((prereq) => {
              const completed = prerequisites.find((p) => p.label === prereq.label)?.!!completed;
              return (
                <div key={prereq.label} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={completed}
                    disabled
                    className="w-5 h-5 rounded border-slate-300"
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${completed ? 'text-green-700' : 'text-slate-700'}`}>
                      {prereq.label}
                    </p>
                  </div>
                  {completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              {prerequisites.filter((p) => p.completed).length} / {PREREQUISITES.length} préalables validés
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
