import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Eventy Life',
  description:
    'Politique de confidentialité RGPD d\'Eventy Life - Protection de vos données personnelles',
};

export default function PolitiqueConfidentialite() {
  const C = {
    navy: '#1A1A2E',
    cream: '#FAF7F2',
    terra: '#C75B39',
    terraLight: '#D97B5E',
    gold: '#D4A853',
    border: '#E5E0D8',
    muted: '#6B7280',
  };

  return (
    <div
      className="min-h-screen animate-fade-up"
      style={{ backgroundColor: C.cream }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p
            className="mb-2 tracking-widest uppercase text-sm font-medium"
            style={{ color: C.gold }}
          >
            Confidentialité
          </p>
          <h1
            className="mb-4 text-4xl font-display font-bold"
            style={{ color: C.navy, fontFamily: 'Playfair Display' }}
          >
            Politique de Confidentialité
          </h1>
          <p className="text-lg" style={{ color: C.muted }}>
            Protection de vos données personnelles - Conforme au RGPD
          </p>
          <p className="mt-2 text-sm" style={{ color: C.muted }}>
            En vigueur à compter du 2 mars 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              Introduction
            </h2>
            <div className="space-y-3" style={{ color: C.navy }}>
              <p>
                Eventy Life SAS (ci-après "l&apos;Entreprise", "nous" ou "le
                Responsable de traitement") s&apos;engage à protéger vos
                données personnelles et à respecter votre vie privée.
              </p>
              <p>
                La présente Politique de Confidentialité explique comment nous
                collectons, utilisons, partageons et protégeons vos données
                personnelles, conformément au Règlement Général sur la
                Protection des Données (RGPD) et à la loi française Informatique
                et Libertés (Loi n° 78-17 du 6 janvier 1978 modifiée).
              </p>
              <p>
                Cette politique s&apos;applique à tous nos services, notamment
                le site www.eventy.life, l&apos;application mobile, les
                formulaires d&apos;inscription et les communications marketing.
              </p>
            </div>
          </section>

          {/* 1. Responsable de traitement */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              1. Responsable de traitement
            </h2>
            <div className="space-y-3" style={{ color: C.navy }}>
              <p>
                <strong>Responsable de traitement :</strong> Eventy Life SAS
              </p>
              <p>
                <strong>Adresse :</strong> 15 rue de la Paix, 75002 Paris,
                France
              </p>
              <p>
                <strong>Email :</strong> contact@eventy.life
              </p>
              <p>
                <strong>Téléphone :</strong> +33 (0)1 23 45 67 89
              </p>
              <p>
                <strong>Délégué à la Protection des Données (DPO) :</strong>{' '}
                dpo@eventy.life
              </p>
              <p className="mt-4 text-sm">
                Le Responsable de traitement est la personne morale ou
                physique qui détermine les finalités et les moyens du
                traitement de vos données personnelles.
              </p>
            </div>
          </section>

          {/* 2. Données collectées */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              2. Données personnelles collectées
            </h2>
            <div className="space-y-4" style={{ color: C.navy }}>
              <div>
                <p className="font-semibold">2.1 Données d&apos;identité</p>
                <p className="mt-2">
                  Nom, prénom, date de naissance, nationalité, numéro de
                  document d&apos;identité (passeport, carte d&apos;identité),
                  situation matrimoniale, nombre d&apos;enfants.
                </p>
              </div>
              <div>
                <p className="font-semibold">2.2 Données de contact</p>
                <p className="mt-2">
                  Adresse postale, adresse email, numéro de téléphone mobile et
                  fixe.
                </p>
              </div>
              <div>
                <p className="font-semibold">2.3 Données financières</p>
                <p className="mt-2">
                  Informations bancaires et de paiement (numéro de carte
                  bancaire masqué, IBAN, nom du titulaire du compte), historique
                  de paiement, factures et reçus.
                </p>
              </div>
              <div>
                <p className="font-semibold">2.4 Données de voyage</p>
                <p className="mt-2">
                  Préférences de voyage, destinations visitées, budget,
                  exigences particulières (régime alimentaire, accessibilité),
                  antécédents de voyage.
                </p>
              </div>
              <div>
                <p className="font-semibold">2.5 Données de santé</p>
                <p className="mt-2">
                  Restrictions de mobilité, conditions médicales déclarées
                  volontairement, besoins en assistance spéciale, allergies,
                  régimes alimentaires pour raisons de santé.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  2.6 Données de navigation et d&apos;utilisation
                </p>
                <p className="mt-2">
                  Adresse IP, type de navigateur, système d&apos;exploitation,
                  pages consultées, durée de visite, clics effectués, interactions
                  avec nos services, informations de géolocalisation (si autorisée).
                </p>
              </div>
              <div>
                <p className="font-semibold">2.7 Données de communication</p>
                <p className="mt-2">
                  Contenu des messages échangés avec notre service client,
                  commentaires et avis publiés, contenu des enquêtes de
                  satisfaction, enregistrements d&apos;appels téléphoniques
                  (avec notification préalable).
                </p>
              </div>
              <div>
                <p className="font-semibold">2.8 Identifiants et données techniques</p>
                <p className="mt-2">
                  Identifiant unique de client, numéro de contrat, identifiants
                  de session, informations de l&apos;appareil, données de
                  connexion.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Finalités du traitement */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              3. Finalités du traitement
            </h2>
            <div className="space-y-4" style={{ color: C.navy }}>
              <p>
                Nous traitons vos données personnelles pour les finalités suivantes :
              </p>
              <div>
                <p className="font-semibold">3.1 Exécution du contrat</p>
                <ul className="mt-2 list-inside space-y-1">
                  <li>- Traitement et confirmation de votre réservation</li>
                  <li>- Facturation et gestion des paiements</li>
                  <li>- Organisation et coordination du voyage</li>
                  <li>- Communication des informations pratiques du voyage</li>
                  <li>- Gestion des modifications et annulation</li>
                  <li>- Assistance client pendant le voyage</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">3.2 Obligations légales</p>
                <ul className="mt-2 list-inside space-y-1">
                  <li>- Respect des obligations fiscales et comptables</li>
                  <li>
                    - Respect des exigences de documentation d&apos;entrée aux
                    frontières
                  </li>
                  <li>
                    - Conformité avec les exigences des autorités de sécurité
                    publique
                  </li>
                  <li>- Respect de la loi anti-fraude et anti-blanchiment</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">3.3 Intérêts légitimes</p>
                <ul className="mt-2 list-inside space-y-1">
                  <li>- Amélioration de nos services et expérience utilisateur</li>
                  <li>- Analyse et statistiques d&apos;utilisation</li>
                  <li>- Prévention de la fraude et sécurité du site</li>
                  <li>
                    - Récupération de créances et contentieux client
                  </li>
                  <li>- Tests A/B et optimisation du site</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">3.4 Consentement</p>
                <ul className="mt-2 list-inside space-y-1">
                  <li>- Communication marketing (newsletters, offres spéciales)</li>
                  <li>- Personnalisation des contenus et recommandations</li>
                  <li>- Enquêtes de satisfaction et feedback</li>
                  <li>- Marketing par email ou SMS</li>
                  <li>
                    - Publicités ciblées sur les réseaux sociaux
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Fondement juridique */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              4. Fondement juridique du traitement
            </h2>
            <div className="space-y-3" style={{ color: C.navy }}>
              <p>
                Nous basons le traitement de vos données sur les fondements
                juridiques suivants, énoncés à l&apos;article 6 du RGPD :
              </p>
              <div>
                <p className="font-semibold">
                  4.1 Exécution d&apos;un contrat (Article 6.1.b)
                </p>
                <p className="mt-2">
                  Le traitement des données nécessaires à la réservation, la
                  facturation et l&apos;organisation du voyage est obligatoire
                  pour conclure et exécuter votre contrat de voyage.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  4.2 Respect d&apos;une obligation légale (Article 6.1.c)
                </p>
                <p className="mt-2">
                  Nous sommes tenus par la loi de conserver certaines données à
                  titre de preuve du contrat, des obligations fiscales et des
                  exigences légales en matière de sécurité.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  4.3 Intérêt légitime (Article 6.1.f)
                </p>
                <p className="mt-2">
                  Pour améliorer nos services, prévenir la fraude et assurer
                  la sécurité, nous traitons certaines données sur la base de
                  notre intérêt légitime, après évaluation qu&apos;il ne porte
                  pas préjudice à vos droits et libertés.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  4.4 Consentement (Article 6.1.a)
                </p>
                <p className="mt-2">
                  Pour les traitements ne relevant pas de la catégorie
                  précédente, notamment le marketing, nous obtenons votre
                  consentement préalable, explicite et informé. Vous pouvez le
                  retirer à tout moment sans justification.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Destinataires des données */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              5. Destinataires des données
            </h2>
            <div className="space-y-3" style={{ color: C.navy }}>
              <p>
                Vos données personnelles sont communiquées aux destinataires suivants :
              </p>
              <ul className="list-inside space-y-2">
                <li>
                  <strong>Prestataires du voyage :</strong> Hôtels, compagnies
                  aériennes, agences de location, guides touristiques (données
                  nécessaires à l&apos;organisation du voyage)
                </li>
                <li>
                  <strong>Prestataires de paiement :</strong> Processeurs de
                  paiement, banques, sociétés de crédit
                </li>
                <li>
                  <strong>Assureurs :</strong> Compagnies d&apos;assurance
                  voyage (si applicable)
                </li>
                <li>
                  <strong>Autorités publiques :</strong> Douanes,
                  autorités d&apos;immigration (si exigé par la loi)
                </li>
                <li>
                  <strong>Prestataires informatiques :</strong> Hébergeurs,
                  fournisseurs de services cloud, sociétés de cybersécurité
                </li>
                <li>
                  <strong>Prestataires marketing :</strong> Plateforme de
                  marketing email, réseaux sociaux (avec votre consentement)
                </li>
                <li>
                  <strong>Professionnels du droit :</strong> Avocats et
                  experts-comptables (en cas de litige ou obligation légale)
                </li>
                <li>
                  <strong>Service client :</strong> Équipes internes
                  d&apos;Eventy Life
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Transferts internationaux */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              6. Transferts de données en dehors de l&apos;UE
            </h2>
            <div className="space-y-4" style={{ color: C.navy }}>
              <p>
                Certaines données peuvent être transférées vers des pays situés
                en dehors de l&apos;Espace Économique Européen (EEE), notamment
                pour :
              </p>
              <ul className="list-inside space-y-2">
                <li>
                  - Organisation de voyages vers des destinations hors UE
                </li>
                <li>- Hébergement dans des serveurs situés aux États-Unis</li>
                <li>- Services fournis par des partenaires internationaux</li>
              </ul>
              <p className="mt-4">
                <strong>Garanties :</strong> Pour les transferts vers les
                États-Unis, nous avons recours aux mécanismes suivants :
              </p>
              <ul className="list-inside space-y-2">
                <li>
                  - <strong>Clauses contractuelles types :</strong> Contrats
                  approuvés par la Commission Européenne incluant des garanties
                  de protection
                </li>
                <li>
                  - <strong>Décisions d&apos;adéquation :</strong> Pour les
                  pays bénéficiant d&apos;une reconnaissance de niveau de
                  protection adéquate
                </li>
                <li>
                  - <strong>Consentement explicite :</strong> Votre
                  consentement préalable au transfert
                </li>
              </ul>
              <p className="mt-4">
                Vous avez le droit de connaître les garanties spécifiques
                applicables. Contactez notre DPO pour plus d&apos;informations.
              </p>
            </div>
          </section>

          {/* 7. Durée de conservation */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              7. Durée de conservation des données
            </h2>
            <div className="space-y-4" style={{ color: C.navy }}>
              <p>
                Nous ne conservons vos données que pendant la période nécessaire
                à chaque finalité :
              </p>
              <table
                className="mt-4 w-full border-collapse"
                style={{ borderColor: C.border }}
              >
                <thead>
                  <tr>
                    <th
                      className="p-2 text-left"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                        fontWeight: 'bold',
                      }}
                    >
                      Type de données
                    </th>
                    <th
                      className="p-2 text-left"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                        fontWeight: 'bold',
                      }}
                    >
                      Durée de conservation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      Données de réservation et voyage
                    </td>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      3 ans après la fin du voyage
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      Données de paiement
                    </td>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      7 ans (obligation comptable) ou jusqu&apos;à la
                      prescription de l&apos;action
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      Données de contact/compte
                    </td>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      Tant que le compte est actif + 2 ans de fermeture
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      Données de navigation/cookies
                    </td>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      13 mois maximum
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      Données marketing
                    </td>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      Jusqu&apos;à retrait du consentement
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      Logs de sécurité
                    </td>
                    <td
                      className="p-2"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.navy,
                      }}
                    >
                      12 mois
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-4 text-sm">
                Une fois la durée expirée, les données sont supprimées ou
                anonymisées de manière irréversible.
              </p>
            </div>
          </section>

          {/* 8. Vos droits */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              8. Vos droits concernant vos données
            </h2>
            <div className="space-y-4" style={{ color: C.navy }}>
              <p>
                Vous disposez des droits suivants, prévus par le RGPD :
              </p>
              <div>
                <p className="font-semibold">
                  8.1 Droit d&apos;accès (Article 15)
                </p>
                <p className="mt-2">
                  Vous pouvez demander l&apos;accès à vos données personnelles
                  traitées par Eventy Life. Nous fournirons une copie dans un
                  format lisible, dans les 30 jours suivant la demande.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  8.2 Droit de rectification (Article 16)
                </p>
                <p className="mt-2">
                  Vous pouvez corriger, mettre à jour ou compléter des données
                  inexactes ou incomplètes. Vous pouvez le faire directement
                  dans votre compte ou en contactant notre DPO.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  8.3 Droit à l&apos;effacement (Article 17)
                </p>
                <p className="mt-2">
                  Vous pouvez demander la suppression de vos données sous
                  certaines conditions, notamment lorsque les données ne sont
                  plus nécessaires ou si vous retirez votre consentement.
                  Cependant, certaines données doivent être conservées pour des
                  raisons légales (obligations comptables).
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  8.4 Droit à la limitation du traitement (Article 18)
                </p>
                <p className="mt-2">
                  Vous pouvez demander à ce que nous restreignions le
                  traitement de vos données, notamment si leur exactitude est
                  contestée ou si vous vous opposez au traitement.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  8.5 Droit à la portabilité des données (Article 20)
                </p>
                <p className="mt-2">
                  Vous pouvez demander à recevoir vos données dans un format
                  structuré, couramment utilisé et lisible par machine, et le
                  droit de les transmettre à un tiers sans obstacles.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  8.6 Droit d&apos;opposition (Article 21)
                </p>
                <p className="mt-2">
                  Vous pouvez vous opposer à tout traitement basé sur notre
                  intérêt légitime ou des fins de marketing direct, notamment
                  en cliquant sur le lien de désinscription dans nos emails.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  8.7 Droit à la non-discrimination
                </p>
                <p className="mt-2">
                  Vous avez le droit de ne pas faire l&apos;objet d&apos;une
                  décision basée exclusivement sur un traitement automatisé. Si
                  une prise de décision automatisée affecte vos droits, vous
                  avez le droit d&apos;obtenir une intervention humaine.
                </p>
              </div>
              <div>
                <p className="font-semibold">8.8 Comment exercer vos droits</p>
                <p className="mt-2">
                  Pour exercer vos droits, veuillez contacter notre Délégué à
                  la Protection des Données :
                </p>
                <p className="mt-2">
                  <strong>Email :</strong> dpo@eventy.life
                  <br />
                  <strong>Adresse :</strong> 15 rue de la Paix, 75002 Paris,
                  France
                </p>
                <p className="mt-2 text-sm">
                  Toute demande sera traitée dans un délai de 30 jours. Nous
                  pourrons vous demander des justificatifs d&apos;identité pour
                  vérifier votre demande.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Sécurité des données */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              9. Sécurité et protection des données
            </h2>
            <div className="space-y-4" style={{ color: C.navy }}>
              <p>
                Nous mettons en œuvre les mesures techniques et organisationnelles
                nécessaires pour protéger vos données contre l&apos;accès non
                autorisé, la modification, la divulgation ou la destruction :
              </p>
              <ul className="list-inside space-y-2">
                <li>
                  - <strong>Chiffrement :</strong> SSL/TLS pour les données en
                  transit, chiffrement des données sensibles au repos
                </li>
                <li>
                  - <strong>Contrôle d&apos;accès :</strong> Authentification
                  multifacteurs, droits d&apos;accès restrictifs
                </li>
                <li>
                  - <strong>Audit :</strong> Tests de pénétration réguliers,
                  audits de sécurité
                </li>
                <li>
                  - <strong>Infrastructure :</strong> Serveurs sécurisés avec
                  pare-feu et systèmes de détection d&apos;intrusion
                </li>
                <li>
                  - <strong>Formation :</strong> Formation des employés sur la
                  confidentialité et la sécurité des données
                </li>
              </ul>
              <p className="mt-4">
                <strong>Limitation de responsabilité :</strong> Malgré nos
                efforts, aucune transmission de données sur Internet n&apos;est
                100% sécurisée. Vous assumez le risque des transmissions
                lorsque vous envoyez vos données à Eventy Life.
              </p>
            </div>
          </section>

          {/* 10. Cookies et traceurs */}
          <section
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              className="mb-4 text-2xl font-semibold"
              style={{ color: C.navy }}
            >
              10. Cookies et technologies de suivi
            </h2>
            <div className="space-y-4" style={{ color: C.navy }}>
              <p>
                Nous utilisons des cookies et technologies similaires pour
                améliorer votre expérience. Pour plus d&apos;informations,
                consultez notre{' '}
                <Link href="/cookies" style={{ color: C.terra }} className="hover:underline">
                  Politique de Cookies
                </Link>
                .
              </p>
              <p>
                Vous pouvez configurer votre navigateur pour refuser les
                cookies et supprimer les cookies existants.
              </p>
            </div>
          </section>

          {/* Final note */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: C.cream,
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <p className="text-sm" style={{ color: C.navy }}>
              <strong>Dernière mise à jour :</strong> 2 mars 2026
            </p>
            <p className="mt-2 text-sm" style={{ color: C.muted }}>
              Cette Politique de Confidentialité est conforme au Règlement
              Général sur la Protection des Données (RGPD) et à la loi française
              Informatique et Libertés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
