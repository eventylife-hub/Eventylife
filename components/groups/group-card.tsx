import React from 'react';
import Link from 'next/link';
import { Users, MapPin } from 'lucide-react';

interface GroupCardProps {
  groupe: {
    id: string;
    code: string;
    leaderUser?: {
      firstName?: string;
      lastName?: string;
    };
    memberCount: number;
    maxRooms?: number | null;
    status: string;
    createdAt: string;
  };
}

/**
 * Card affichant un groupe de voyage
 * Affiche les infos et le bouton de rejoindre
 */
export const GroupCard = React.memo(function GroupCard({ groupe }: GroupCardProps) {
  const maxMembers = groupe.maxRooms ? groupe.maxRooms * 2 : null;
  const isFull = maxMembers && groupe.memberCount >= maxMembers;
  const spotsLeft = maxMembers ? maxMembers - groupe.memberCount : null;

  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-shadow">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold">Groupe</h3>
      </div>
      <div className="space-y-4 p-6 pt-4">
        {/* Leader */}
        {groupe.leaderUser && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {groupe.leaderUser.firstName} {groupe.leaderUser.lastName}
            </span>
          </div>
        )}

        {/* Membres */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {groupe.memberCount} membre{groupe.memberCount > 1 ? 's' : ''}
            {maxMembers && ` / ${maxMembers}`}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isFull ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{
                width: maxMembers
                  ? `${(groupe.memberCount / maxMembers) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>

        {/* Code */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Code</p>
          <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {groupe.code}
          </p>
        </div>

        {/* Bouton */}
        <Link href={`/voyages/${groupe.id}/rejoindre`} className="block">
          <button
            className={`w-full px-4 py-2 rounded-lg transition-colors disabled:opacity-50 min-h-[44px] font-medium ${
              isFull
                ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={!!isFull}
          >
            {isFull ? 'Groupe plein' : 'Rejoindre'}
          </button>
        </Link>

        {spotsLeft && spotsLeft > 0 && (
          <p className="text-xs text-center text-gray-500">
            {spotsLeft} place{spotsLeft > 1 ? 's' : ''} disponible{spotsLeft > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
});
