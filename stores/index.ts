/**
 * Point d'entrée centralisé pour tous les stores métier
 * Facilite les importations : import { useCancellationStore, useGroupsStore } from '@/stores'
 * au lieu de : import { useCancellationStore } from '@/stores/cancellation-store'
 */

export * from './cancellation-store';
export * from './consent-store';
export * from './finance-store';
export * from './groups-store';
export * from './marketing-store';
export * from './post-sale-store';
export * from './rooming-store';
export * from './transport-store';
