import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
export function GroupCard({ groupe }: GroupCardProps) {
  const maxMembers = groupe.maxRooms ? groupe.maxRooms * 2 : null;
  const isFull = maxMembers && groupe.memberCount >= maxMembers;
  const spotsLeft = maxMembers ? maxMembers - groupe.memberCount : null;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Groupe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <Button
            className="w-full"
            disabled={!!isFull}
            variant={isFull ? 'outline' : 'primary'}
          >
            {isFull ? 'Groupe plein' : 'Rejoindre'}
          </Button>
        </Link>

        {spotsLeft && spotsLeft > 0 && (
          <p className="text-xs text-center text-gray-500">
            {spotsLeft} place{spotsLeft > 1 ? 's' : ''} disponible{spotsLeft > 1 ? 's' : ''}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
