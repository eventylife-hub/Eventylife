import React from 'react';
import { Crown, Shield, Trash2 } from 'lucide-react';

interface Member {
  id: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatarUrl?: string;
  };
  role: 'LEADER' | 'MEMBER' | 'ASSOCIATION';
  joinedAt: string;
}

interface MemberListProps {
  members: Member[];
  currentUserRole?: string;
  canManage?: boolean;
  onKick?: (memberId: string) => void;
  onPromote?: (memberId: string) => void;
}

/**
 * Liste des membres du groupe avec rôles et actions
 */
export function MemberList({
  members,
  currentUserRole,
  canManage,
  onKick,
  onPromote,
}: MemberListProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'LEADER':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'ASSOCIATION':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'LEADER':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASSOCIATION':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div className="flex items-center gap-3 flex-1">
            {member.user.avatarUrl && (
              <img
                src={member.user.avatarUrl}
                alt={member.user.firstName}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold">
                {member.user.firstName} {member.user.lastName}
              </p>
              <p className="text-xs text-gray-500">{member.user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
              <span className="flex items-center gap-1">
                {getRoleIcon(member.role)}
                {member.role === 'LEADER'
                  ? 'Leader'
                  : member.role === 'ASSOCIATION'
                  ? 'Association'
                  : 'Membre'}
              </span>
            </span>

            {canManage && currentUserRole === 'LEADER' && (
              <div className="flex gap-1">
                {member.role !== 'LEADER' && onPromote && (
                  <button
                    onClick={() => onPromote(member.id)}
                    title="Promouvoir en leader"
                    aria-label="Promouvoir en leader"
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px]"
                  >
                    <Crown className="h-4 w-4" />
                  </button>
                )}
                {onKick && (
                  <button
                    onClick={() => onKick(member.id)}
                    title="Exclure"
                    aria-label="Exclure le membre"
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px]"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
