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

        const data = await res.json();
        setTeam(data.team || []);
        setPrerequisites(data.prerequisites || []);
        setError(null);
      } catch (err) {
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

      const newMember = await res.json();
      setTeam([...team, newMember]);
      setInviteEmail('');
      setInviteRole('VENDEUR');
      setShowInviteModal(false);
      setError(null);
    } catch (err) {
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
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Équipe du voyage</h1>
          <p className="text-slate-600 mt-2">Gérez les membres et les préalables</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Inviter un membre
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <Card className="bg-white border-indigo-200 border-2">
          <CardHeader>
            <CardTitle>Inviter un membre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="pro@example.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'CREATOR' | 'INDEPENDANT' | 'VENDEUR')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleInvite} disabled={inviting}>
                {inviting ? 'Invitation...' : 'Inviter'}
              </Button>
              <Button onClick={() => setShowInviteModal(false)} variant="outline">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Membres de l'équipe
          </CardTitle>
          <CardDescription>{team.length} membre(s)</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Prerequisites Checklist */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Préalables avant lancement
          </CardTitle>
          <CardDescription>Éléments à valider avant la publication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {PREREQUISITES.map((prereq) => {
              const completed = prerequisites.find((p) => p.label === prereq.label)?.completed || false;
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
        </CardContent>
      </Card>
    </div>
  );
}
