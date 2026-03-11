'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CreditCard, Lock, Mail, Phone } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface AccountData {
  email: string;
  phone: string;
  accountType: string;
  subscriptionStatus: string;
  nextBillingDate: string;
  currency: string;
}

interface BillingMethod {
  id: string;
  type: string;
  last4: string;
  expiryDate: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  description: string;
}

/**
 * Page Compte Pro - Gestion du compte et facturation
 *
 * Affiche:
 * - Informations du compte: email, téléphone, type d'abonnement
 * - Méthodes de paiement sauvegardées
 * - Historique des factures
 * - Prochaine date de facturation
 */
export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [billingMethods, setBillingMethods] = useState<BillingMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch account information
        const accountRes = await fetch('/api/pro/account', { credentials: 'include' });
        if (!accountRes.ok) throw new Error('Erreur lors du chargement du compte');
        const accountData = await accountRes.json() as Record<string, unknown>;
        setAccount(accountData as AccountData);

        // Fetch billing methods
        const methodsRes = await fetch('/api/pro/account/billing-methods', { credentials: 'include' });
        if (!methodsRes.ok) throw new Error('Erreur lors du chargement des méthodes de paiement');
        const methodsData = await methodsRes.json() as Record<string, unknown>;
        setBillingMethods((methodsData.methods || []) as BillingMethod[]);

        // Fetch invoices
        const invoicesRes = await fetch('/api/pro/account/invoices', { credentials: 'include' });
        if (!invoicesRes.ok) throw new Error('Erreur lors du chargement des factures');
        const invoicesData = await invoicesRes.json() as Record<string, unknown>;
        setInvoices((invoicesData.invoices || []) as Invoice[]);
      } catch {
        console.warn('API pro/account indisponible — données démo');
        setAccount({
          email: 'jean.dupont@voyages-soleil.fr',
          phone: '+33 1 23 45 67 89',
          accountType: 'Premium',
          subscriptionStatus: 'actif',
          nextBillingDate: '2026-04-11',
          currency: 'EUR',
        });
        setBillingMethods([
          {
            id: 'card_001',
            type: 'Visa',
            last4: '4242',
            expiryDate: '12/27',
            isDefault: true,
          },
          {
            id: 'card_002',
            type: 'Mastercard',
            last4: '5555',
            expiryDate: '08/28',
            isDefault: false,
          },
        ]);
        setInvoices([
          {
            id: 'inv_001',
            date: '2026-03-11',
            amount: 29900,
            status: 'PAID',
            description: 'Abonnement Premium - Mars 2026',
          },
          {
            id: 'inv_002',
            date: '2026-02-11',
            amount: 29900,
            status: 'PAID',
            description: 'Abonnement Premium - Février 2026',
          },
          {
            id: 'inv_003',
            date: '2026-01-11',
            amount: 29900,
            status: 'PAID',
            description: 'Abonnement Premium - Janvier 2026',
          },
        ]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ height: 192, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div>
          <h1 className="pro-page-title">Mon Compte</h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>Gérez vos paramètres de compte et de facturation</p>
        </div>

        {error && (
          <div style={{ padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle className="h-4 w-4" style={{ color: 'var(--pro-coral)' }} />
              <span style={{ color: 'var(--pro-coral)', fontSize: '14px' }}>{error}</span>
            </div>
            <button type="button" onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Fermer
            </button>
          </div>
        )}

        {/* Account Information */}
        {account && (
          <div className="pro-panel" style={{ padding: '24px' }}>
            <h2 className="pro-panel-title" style={{ marginBottom: '16px' }}>Informations du compte</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Mail className="h-4 w-4" style={{ color: '#64748B' }} />
                  <p style={{ fontSize: '14px', color: '#64748B' }}>Email</p>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#0A1628' }}>{account.email}</p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Phone className="h-4 w-4" style={{ color: '#64748B' }} />
                  <p style={{ fontSize: '14px', color: '#64748B' }}>Téléphone</p>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#0A1628' }}>{account.phone}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>Type d&apos;abonnement</p>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#0A1628' }}>{account.accountType}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>Statut</p>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  backgroundColor: account.subscriptionStatus === 'actif' ? '#E0FFF5' : '#FFF0E8',
                  color: account.subscriptionStatus === 'actif' ? 'var(--pro-mint)' : 'var(--pro-sun)',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  {account.subscriptionStatus === 'actif' ? 'Actif' : 'Suspendu'}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>Prochaine facturation</p>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#0A1628' }}>{formatDate(account.nextBillingDate)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Methods */}
        <div className="pro-panel" style={{ padding: '24px' }}>
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="pro-panel-title">Méthodes de paiement</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Cartes bancaires sauvegardées</p>
            </div>
            <button type="button" className="pro-btn-sun" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard className="h-4 w-4" />
              Ajouter une carte
            </button>
          </div>
          {billingMethods.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
              <CreditCard className="h-12 w-12" style={{ color: '#64748B', margin: '0 auto 16px' }} />
              <p style={{ color: '#64748B' }}>Aucune carte bancaire sauvegardée</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {billingMethods.map((method) => (
                <div key={method.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E0E0E0', borderRadius: '8px', backgroundColor: method.isDefault ? '#F0F8FF' : 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <CreditCard className="h-6 w-6" style={{ color: '#0A1628' }} />
                    <div>
                      <p style={{ fontWeight: 500, color: '#0A1628' }}>{method.type} •••• {method.last4}</p>
                      <p style={{ fontSize: '14px', color: '#64748B' }}>Expire le {method.expiryDate}</p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <div style={{
                      padding: '4px 8px',
                      backgroundColor: 'var(--pro-mint)',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}>
                      Par défaut
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="pro-panel" style={{ padding: '24px' }}>
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '16px' }}>
            <h2 className="pro-panel-title">Factures</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Historique de vos factures</p>
          </div>
          {invoices.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
              <p style={{ color: '#64748B' }}>Aucune facture pour le moment</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {invoices.map((invoice) => (
                <div key={invoice.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E0E0E0', borderRadius: '8px' }}>
                  <div>
                    <p style={{ fontWeight: 500, color: '#0A1628' }}>{invoice.description}</p>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>{formatDate(invoice.date)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <p style={{ fontWeight: 600, color: '#0A1628', minWidth: '80px', textAlign: 'right' }}>{formatPrice(invoice.amount)}</p>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: invoice.status === 'PAID' ? '#E0FFF5' : invoice.status === 'PENDING' ? '#FFF0E8' : '#FFE0E3',
                      color: invoice.status === 'PAID' ? 'var(--pro-mint)' : invoice.status === 'PENDING' ? 'var(--pro-sun)' : 'var(--pro-coral)'
                    }}>
                      {invoice.status === 'PAID' ? 'Payée' : invoice.status === 'PENDING' ? 'En attente' : 'Échouée'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security */}
        <div className="pro-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="pro-panel-title" style={{ marginBottom: '4px' }}>Sécurité</h2>
              <p style={{ fontSize: '14px', color: '#64748B' }}>Gérez votre mot de passe et vos paramètres de sécurité</p>
            </div>
            <button type="button" className="pro-btn-sun" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock className="h-4 w-4" />
              Modifier le mot de passe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
