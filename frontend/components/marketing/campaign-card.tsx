import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock } from 'lucide-react';

interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    description?: string;
    status: string;
    budget: number;
    startDate?: string;
    endDate?: string;
    createdAt: string;
  };
}

/**
 * Card affichant une campagne marketing
 */
export function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'ENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'LIVE':
        return 'Active';
      case 'SCHEDULED':
        return 'Planifiée';
      case 'DRAFT':
        return 'Brouillon';
      case 'ENDED':
        return 'Terminée';
      default:
        return status;
    }
  };

  return (
    <Link href={`/pro/marketing/${campaign.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">
              {campaign.title}
            </CardTitle>
            <Badge className={getStatusColor(campaign.status)}>
              {getStatusLabel(campaign.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaign.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {campaign.description}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Budget</span>
              <span className="font-semibold">
                {(campaign.budget / 100).toFixed(2)}€
              </span>
            </div>

            {campaign.startDate && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>
                  À partir du{' '}
                  {new Date(campaign.startDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Voir détails
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
