/**
 * Route API Mock — GET/POST /api/support/tickets
 * Mode démo : tickets support client
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextRequest, NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

const MOCK_TICKETS = [
  {
    id: 'tkt_001',
    subject: 'Question sur le ramassage porte-à-porte',
    category: 'TRANSPORT',
    status: 'OPEN',
    priority: 'NORMAL',
    lastMessage: 'Bonjour, je voudrais savoir si le ramassage peut se faire à une adresse différente de mon domicile...',
    messagesCount: 2,
    createdAt: '2026-03-05T10:30:00Z',
    updatedAt: '2026-03-06T14:15:00Z',
  },
  {
    id: 'tkt_002',
    subject: 'Modification de réservation Marrakech',
    category: 'BOOKING',
    status: 'RESOLVED',
    priority: 'HIGH',
    lastMessage: 'Votre modification a bien été prise en compte. Vous recevrez un email de confirmation.',
    messagesCount: 5,
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-02-22T16:45:00Z',
  },
];

export async function GET() {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  return NextResponse.json({ items: MOCK_TICKETS, total: MOCK_TICKETS.length });
}

export async function POST(request: NextRequest) {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  try {
    const body = await request.json();
    const newTicket = {
      id: `tkt_${Date.now()}`,
      subject: body.subject,
      category: body.category || 'GENERAL',
      status: 'OPEN',
      priority: 'NORMAL',
      lastMessage: body.message,
      messagesCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(newTicket, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
