import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions Légales | Eventy Life',
  description: 'Mentions légales d\'Eventy Life : informations sur l\'éditeur, l\'hébergeur, la propriété intellectuelle et les conditions d\'utilisation du site.',
};

export default function MentionsLegales() {
  return (
    <div
      className="min-h-screen animate-fade-up"
      style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p
            className="mb-2 tracking-widest uppercase text-sm font-medium"
            style={{ color: 'var(--gold, #D4A853)' }}
          >
            Informations
          </p>
          <h1
            className="mb-4 text-4xl font-display font-bold"
            style={{ color: 'var(--navy, #1A1A2E)', fontFamily: 'Playfair Display' }}
          >
            Mentions Légales
          </h1>
          <p className="text-lg" style={{ color: '#6B7280' }}>
            Informations légales relatives au site Eventy Life
          </p>
        </div>

        <div className="space-y-12">
          {/* Éditeur du site */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Éditeur du site
            </h2>
            <div className="space-y-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                <strong>Entreprise :</strong> Eventy Life SAS
              </p>
              <p>
                <strong>SIRET :</strong> 123 456 789 00012
              </p>
              <p>
                <strong>TVA Intracommunautaire :</strong> FR12123456789
              </p>
              <p>
                <strong>Siège social :</strong> 15 rue de la Paix, 75002 Paris,
                France
              </p>
              <p>
                <strong>Téléphone :</strong> +33 (0)1 23 45 67 89
              </p>
              <p>
                <strong>Email :</strong>{' '}
                <a
                  href="mailto:contact@eventylife.fr"
                  style={{ color: 'var(--terra, #C75B39)' }}
                  className="hover:underline"
                >
                  contact@eventylife.fr
                </a>
              </p>
              <p>
                <strong>Capital Social :</strong> 50 000 EUR
              </p>
            </div>
          </section>

          {/* Directeur de publication */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Directeur de la publication
            </h2>
            <div style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                <strong>Directeur de publication :</strong> Martin Dupont
              </p>
              <p className="mt-2 text-sm">
                Le directeur de la publication est responsable de la conformité
                du contenu du site avec la législation en vigueur.
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Hébergement
            </h2>
            <div className="space-y-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                <strong>Hébergeur :</strong> Vercel Inc.
              </p>
              <p>
                <strong>Adresse :</strong> 340 S Lemon Ave, Walnut, CA 91789,
                États-Unis
              </p>
              <p>
                <strong>Site web :</strong>{' '}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--terra, #C75B39)' }}
                  className="hover:underline"
                >
                  www.vercel.com
                </a>
              </p>
              <p className="mt-4 text-sm">
                Vercel Inc. est responsable de l&apos;hébergement et de la
                disponibilité technique du site.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Responsabilité du contenu
            </h2>
            <div className="space-y-3" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                Eventy Life SAS s&apos;efforce de maintenir les informations
                contenues sur ce site à jour et exactes. Cependant, elle ne
                peut garantir l&apos;absence d&apos;erreurs ou
                d&apos;omissions.
              </p>
              <p>
                Eventy Life SAS ne pourra être tenue responsable des dommages
                directs ou indirects résultant de l&apos;accès ou de
                l&apos;utilisation du site, notamment des pertes de données,
                interruptions de service ou erreurs dans les informations
                fournies.
              </p>
              <p>
                Les liens hypertextes présents sur le site vers d&apos;autres
                sites ne constituent pas un cautionnement. Eventy Life SAS
                décline toute responsabilité quant au contenu des sites tiers.
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Propriété intellectuelle
            </h2>
            <div className="space-y-3" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                Tous les contenus du site (textes, images, graphiques, logos,
                vidéos, icônes) sont la propriété d&apos;Eventy Life SAS ou de
                ses partenaires et sont protégés par les droits
                d&apos;auteur et de propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification ou
                exploitation non autorisée de ces contenus est strictement
                interdite.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Protection des données personnelles
            </h2>
            <div className="space-y-3" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                Le site collecte des données personnelles conformément à la
                législation applicable, notamment le Règlement Général sur la
                Protection des Données (RGPD).
              </p>
              <p>
                Pour plus d&apos;informations sur le traitement de vos données
                personnelles, veuillez consulter notre{' '}
                <Link
                  href="/politique-confidentialite"
                  style={{ color: 'var(--terra, #C75B39)' }}
                  className="hover:underline"
                >
                  Politique de Confidentialité
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Cookies et traceurs
            </h2>
            <div className="space-y-3" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                Le site utilise des cookies et des technologies similaires pour
                améliorer l&apos;expérience utilisateur et mesurer
                l&apos;audience.
              </p>
              <p>
                Pour plus de détails et pour gérer vos préférences de cookies,
                veuillez consulter notre{' '}
                <Link href="/cookies" style={{ color: 'var(--terra, #C75B39)' }} className="hover:underline">
                  Politique de Cookies
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Conditions d'utilisation */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Conditions d&apos;utilisation
            </h2>
            <div className="space-y-3" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                L&apos;utilisation du site implique l&apos;acceptation de ces
                mentions légales et des{' '}
                <Link href="/cgv" style={{ color: 'var(--terra, #C75B39)' }} className="hover:underline">
                  Conditions Générales de Vente
                </Link>
                .
              </p>
              <p>
                Eventy Life SAS se réserve le droit de modifier ces mentions à
                tout moment sans préavis.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Nous contacter
            </h2>
            <div className="space-y-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                Pour toute question concernant ces mentions légales, veuillez
                nous contacter :
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <strong>Email :</strong>{' '}
                  <a
                    href="mailto:legal@eventylife.fr"
                    style={{ color: 'var(--terra, #C75B39)' }}
                    className="hover:underline"
                  >
                    legal@eventylife.fr
                  </a>
                </li>
                <li>
                  <strong>Adresse :</strong> 15 rue de la Paix, 75002 Paris,
                  France
                </li>
                <li>
                  <strong>Téléphone :</strong> +33 (0)1 23 45 67 89
                </li>
              </ul>
            </div>
          </section>

          {/* Date de mise à jour */}
          <div
            className="rounded-lg p-6 text-sm"
            style={{
              backgroundColor: 'var(--cream, #FAF7F2)',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
              color: '#6B7280',
            }}
          >
            <p>
              <strong>Dernière mise à jour :</strong> 2 mars 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
