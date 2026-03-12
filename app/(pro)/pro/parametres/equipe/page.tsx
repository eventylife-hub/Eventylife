'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'agent' | 'consultant';
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
  lastActive?: string;
  permissions?: string[];
}

interface TeamSettings {
  id: string;
  proId: string;
  maxTeamMembers: number;
  currentMemberCount: number;
  members: TeamMember[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Page Paramètres Équipe - Gestion de l'équipe
 *
 * Affiche:
 * - Liste des membres de l'équipe
 * - Rôles et permissions
 * - Statut des membres
 * - Ajouter/supprimer des membres
 *
 * États UI:
 * - Loading: Skeleton
 * - Error: Données démo affichées
 * - Data: Liste équipe avec actions
 */
export default function EquipePage() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamSettings | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    const fetchTeamSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pro/team-settings', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement de l\'équipe');

        const data = await res.json() as TeamSettings;
        setTeam(data);
      } catch {
        logger.warn('API équipe indisponible — données démo');
        setTeam({
          id: 'team_001',
          proId: 'pro_001',
          maxTeamMembers: 10,
          currentMemberCount: 4,
          members: [
            {
              id: 'mem_001',
              name: 'Sophie Martin',
              email: 'sophie.martin@agence-voyages.fr',
              phone: '+33 1 23 45 67 89',
              role: 'admin',
              status: 'active',
              joinedAt: '2025-01-15T10:00:00Z',
              lastActive: '2026-03-11T16:30:00Z',
              permissions: ['full_access', 'manage_team', 'manage_finances'],
            },
            {
              id: 'mem_002',
              name: 'Pierre Dupont',
              email: 'pierre.dupont@agence-voyages.fr',
              phone: '+33 1 87 65 43 21',
              role: 'manager',
              status: 'active',
              joinedAt: '2025-02-01T09:00:00Z',
              lastActive: '2026-03-11T15:45:00Z',
              permissions: ['view_reports', 'manage_reservations', 'manage_travels'],
            },
            {
              id: 'mem_003',
              name: 'Marie Leclerc',
              email: 'marie.leclerc@agence-voyages.fr',
              phone: '+33 1 56 78 90 12',
              role: 'agent',
              status: 'active',
              joinedAt: '2025-03-01T14:00:00Z',
              lastActive: '2026-03-10T18:15:00Z',
              permissions: ['view_reservations', 'create_reservations'],
            },
            {
              id: 'mem_004',
              name: 'Jean Bernard',
              email: 'jean.bernard@agence-voyages.fr',
              phone: '+33 1 34 56 78 90',
              role: 'consultant',
              status: 'pending',
              joinedAt: '2026-03-09T11:00:00Z',
              lastActive: undefined,
              permissions: ['view_travels'],
            },
          ],
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2026-03-11T10:00:00Z',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamSettings();
  }, []);

  const getRoleLabel = (role: string): string => {
    const roles: Record<string, string> = {
      admin: 'Administrateur',
      manager: 'Manager',
      agent: 'Agent',
      consultant: 'Consultant',
    };
    return roles[role] || role;
  };

  const getStatusColor = (status: string): { bg: string; text: string; label: string } => {
    const statuses: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: '#DCFCE7', text: '#166534', label: 'Actif' },
      inactive: { bg: '#FEE2E2', text: '#991B1B', label: 'Inactif' },
      pending: { bg: '#FEF3C7', text: '#92400E', label: 'En attente' },
    };
    return statuses[status] || statuses.inactive;
  };

  if (loading) {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 384, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 className="pro-page-title">Équipe</h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>Gérez les membres de votre équipe et leurs permissions</p>
        </div>

        {/* Résumé */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="pro-panel" style={{ padding: '16px' }}>
            <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Membres actuels
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#0A1628' }}>
              {team?.currentMemberCount || 0}
              <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 400, marginLeft: '8px' }}>
                / {team?.maxTeamMembers || 10}
              </span>
            </p>
          </div>
          <div className="pro-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Nombre de places disponibles
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#0A1628' }}>
                {((team?.maxTeamMembers || 0) - (team?.currentMemberCount || 0)) || 0}
              </p>
            </div>
            <button type="button" className="pro-btn-sun" onClick={() => setShowAddForm(!showAddForm)}>
              + Ajouter un membre
            </button>
          </div>
        </div>

        {/* Formulaire ajout */}
        {showAddForm && (
          <div className="pro-panel">
            <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 className="pro-panel-title">Inviter un nouveau membre</h3>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>
                  Adresse email
                </label>
                <input
                  type="email"
                  className="pro-input"
                  placeholder="membre@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>
                  Rôle
                </label>
                <select className="pro-input">
                  <option value="agent">Agent</option>
                  <option value="manager">Manager</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="pro-btn-outline" onClick={() => setShowAddForm(false)}>
                  Annuler
                </button>
                <button type="button" className="pro-btn-sun">
                  Envoyer l&apos;invitation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste équipe */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 className="pro-panel-title">Membres de l&apos;équipe ({team?.currentMemberCount || 0})</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Gestion des membres et permissions</p>
          </div>

          {team?.members && team.members.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead style={{ borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Nom</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Email</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Rôle</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Statut</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Dernier accès</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {team.members.map((member) => {
                    const statusColor = getStatusColor(member.status);
                    return (
                      <tr key={member.id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', fontWeight: 500, color: '#0A1628' }}>
                          {member.name}
                        </td>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', color: '#64748B' }}>
                          {member.email}
                        </td>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', color: '#0A1628' }}>
                          {getRoleLabel(member.role)}
                        </td>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                              fontSize: '12px',
                              fontWeight: 600,
                              borderRadius: '6px',
                            }}
                          >
                            {statusColor.label}
                          </span>
                        </td>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', color: '#64748B' }}>
                          {member.lastActive ? new Date(member.lastActive).toLocaleDateString('fr-FR') : 'N/A'}
                        </td>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'right' }}>
                          <button type="button" className="pro-btn-outline" style={{ padding: '4px 12px', fontSize: '12px', marginRight: '8px' }}>
                            Modifier
                          </button>
                          <button type="button" className="pro-btn-outline" style={{ padding: '4px 12px', fontSize: '12px', color: 'var(--pro-coral)', borderColor: 'var(--pro-coral)' }}>
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
              <p style={{ color: '#64748B' }}>Aucun membre dans l&apos;équipe</p>
            </div>
          )}
        </div>

        {/* Rôles et permissions */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 className="pro-panel-title">Rôles et permissions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                role: 'admin',
                label: 'Administrateur',
                desc: 'Accès complet à tous les paramètres et données',
                permissions: ['Gestion complète', 'Gestion de l\'équipe', 'Gestion financière'],
              },
              {
                role: 'manager',
                label: 'Manager',
                desc: 'Accès aux rapports et gestion des voyages et réservations',
                permissions: ['Voir les rapports', 'Gestion des voyages', 'Gestion des réservations'],
              },
              {
                role: 'agent',
                label: 'Agent',
                desc: 'Accès limité aux réservations et consultations',
                permissions: ['Voir les réservations', 'Créer des réservations'],
              },
              {
                role: 'consultant',
                label: 'Consultant',
                desc: 'Accès en lecture seule à certaines fonctionnalités',
                permissions: ['Voir les voyages'],
              },
            ].map(({ role, label, desc, permissions }) => (
              <div key={role} style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E0E0E0' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628', marginBottom: '4px' }}>
                  {label}
                </p>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
                  {desc}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {permissions.map((perm) => (
                    <span
                      key={perm}
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: '#E0F2FE',
                        color: '#0369A1',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '4px',
                      }}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
