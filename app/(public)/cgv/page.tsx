import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | Eventy Life',
  description: 'Consultez les conditions générales de vente d\'Eventy Life : réservations, paiements, annulations, assurances et responsabilités pour vos voyages de groupe.',
};

export default function CGV() {
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
            Conditions Légales
          </p>
          <h1
            className="mb-4 text-4xl font-display font-bold"
            style={{ color: 'var(--navy, #1A1A2E)', fontFamily: 'Playfair Display' }}
          >
            Conditions Générales de Vente
          </h1>
          <p className="text-lg" style={{ color: '#6B7280' }}>
            Conditions applicables aux voyages organisés proposés par Eventy
            Life
          </p>
          <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
            En vigueur à compter du 2 mars 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* Article 1 */}
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
              Article 1 : Objet
            </h2>
            <div className="space-y-3" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                Les présentes Conditions Générales de Vente (ci-après "CGV")
                régissent les relations contractuelles entre Eventy Life SAS
                (ci-après "l&apos;Organisateur") et les personnes physiques
                qui effectuent une réservation sur le site
                www.eventylife.fr (ci-après "le Client").
              </p>
              <p>
                Elles s&apos;appliquent de manière exclusive à tous les
                voyages organisés, circuits touristiques, week-ends,
                séjours et prestations de voyage proposés par
                l&apos;Organisateur, quel qu&apos;en soit le mode de
                commercialisation (site internet, agences de voyage
                partenaires, courrier, téléphone).
              </p>
              <p>
                L&apos;acceptation de ces CGV est obligatoire pour
                procéder à une réservation. En validant sa réservation,
                le Client accepte sans réserve les présentes conditions.
              </p>
            </div>
          </section>

          {/* Article 2 */}
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
              Article 2 : Définitions
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">
                  2.1 Voyage organisé ou circuit touristique
                </p>
                <p className="mt-2">
                  Ensemble de prestations touristiques combinant au moins
                  transport, hébergement et services supplémentaires,
                  d&apos;une durée supérieure à 24 heures ou incluant une
                  nuit, proposé à prix forfaitaire.
                </p>
              </div>
              <div>
                <p className="font-semibold">2.2 Prestataires</p>
                <p className="mt-2">
                  Hôtels, compagnies aériennes, agences de location de
                  voitures, guides touristiques, restaurants et tout autre
                  fournisseur de services engagé par l&apos;Organisateur pour
                  la réalisation du voyage.
                </p>
              </div>
              <div>
                <p className="font-semibold">2.3 Client</p>
                <p className="mt-2">
                  Toute personne qui accepte les présentes CGV et effectue
                  une réservation auprès d&apos;Eventy Life, incluant les
                  voyageurs accompagnants.
                </p>
              </div>
              <div>
                <p className="font-semibold">2.4 Groupe</p>
                <p className="mt-2">
                  Ensemble de clients effectuant une réservation groupée pour
                  le même voyage, avec un minimum de 10 personnes.
                </p>
              </div>
              <div>
                <p className="font-semibold">2.5 Devis et Propositions</p>
                <p className="mt-2">
                  Documents transmis par l&apos;Organisateur détaillant le
                  programme, les prestations, les tarifs et conditions
                  spécifiques du voyage. Ces documents restent valables 30
                  jours civils à compter de leur émission.
                </p>
              </div>
            </div>
          </section>

          {/* Article 3 */}
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
              Article 3 : Inscription et réservation
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">3.1 Réservation en ligne</p>
                <p className="mt-2">
                  Le Client remplit le formulaire de réservation disponible
                  sur le site. L&apos;Organisateur envoie un email de
                  confirmation de réservation à l&apos;adresse fournie.
                </p>
              </div>
              <div>
                <p className="font-semibold">3.2 Données personnelles</p>
                <p className="mt-2">
                  Le Client doit fournir des informations exactes, complètes
                  et à jour. Toute erreur ou omission peut entrainer
                  l&apos;annulation de la réservation.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  3.3 Conditions d&apos;accès et de participation
                </p>
                <p className="mt-2">
                  Les voyageurs doivent être en possession de documents
                  d&apos;identité valides (passeport, visa si nécessaire).
                  L&apos;Organisateur ne peut être tenu responsable des
                  refus d&apos;embarquement pour défaut de documentation.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  3.4 Conditions de santé et de handicap
                </p>
                <p className="mt-2">
                  Le Client doit signaler à l&apos;Organisateur tout
                  problème de santé, restriction de mobilité ou
                  aménagement spécial requis au moment de la réservation,
                  afin que l&apos;Organisateur puisse adapter le programme
                  si nécessaire.
                </p>
              </div>
            </div>
          </section>

          {/* Article 4 */}
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
              Article 4 : Prix et paiement
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">4.1 Tarification</p>
                <p className="mt-2">
                  Les prix affichés sur le site sont exprimés en euros TTC,
                  incluant les taxes applicables au moment de la publication.
                  Les prix sont par personne, sauf mention contraire. Ils
                  incluent les prestations mentionnées dans la description et
                  excluent les services optionnels, assurances, et frais
                  administratifs.
                </p>
              </div>
              <div>
                <p className="font-semibold">4.2 Variations de prix</p>
                <p className="mt-2">
                  L&apos;Organisateur se réserve le droit d&apos;ajuster les
                  tarifs jusqu&apos;à 30 jours avant le départ en cas de
                  variation significative des coûts de carburant, taux de
                  change ou taxes. Une majoration supérieure à 8% donne droit
                  au Client de se désister sans pénalité.
                </p>
              </div>
              <div>
                <p className="font-semibold">4.3 Conditions de paiement</p>
                <p className="mt-2">
                  <strong>Acompte :</strong> Un acompte de 30% du prix total
                  est requis à la confirmation de la réservation.
                </p>
                <p className="mt-2">
                  <strong>Solde :</strong> Le solde est à payer au plus tard
                  45 jours avant la date de départ du voyage.
                </p>
                <p className="mt-2">
                  <strong>Modes de paiement :</strong> Carte bancaire, virement
                  bancaire, chèque.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  4.4 Paiement fractionné et Split-Pay
                </p>
                <p className="mt-2">
                  L&apos;Organisateur propose un service de paiement
                  fractionné permettant au Client de payer en plusieurs
                  mensualités sans intérêt supplémentaire, sous conditions
                  d&apos;acceptation. Cette option est disponible pour les
                  voyages dont le prix total dépasse 500 euros et dont le
                  départ est prévu au minimum 60 jours à l&apos;avance.
                </p>
                <p className="mt-2">
                  Les frais administratifs du service de paiement fractionné,
                  si applicables, sont détaillés au moment de
                  l&apos;acceptation.
                </p>
              </div>
              <div>
                <p className="font-semibold">4.5 Non-paiement du solde</p>
                <p className="mt-2">
                  L&apos;absence de paiement du solde à la date limite
                  entraîne l&apos;annulation automatique de la réservation.
                  L&apos;acompte versé reste acquis à l&apos;Organisateur.
                </p>
              </div>
              <div>
                <p className="font-semibold">4.6 Devis groupé</p>
                <p className="mt-2">
                  Un devis spécifique est établi pour les groupes de 10
                  personnes ou plus. Le coordinateur du groupe effectue la
                  réservation au nom du groupe et assume la responsabilité
                  du paiement du prix global.
                </p>
              </div>
            </div>
          </section>

          {/* Article 5 */}
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
              Article 5 : Droit de rétractation
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">5.1 Délai de rétractation</p>
                <p className="mt-2">
                  Conformément à la législation française et européenne, le
                  Client dispose d&apos;un délai de 14 jours calendaires pour
                  se rétracter, à compter de la confirmation de sa réservation,
                  sauf exceptions prévues à l&apos;article 5.2.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  5.2 Exceptions au droit de rétractation
                </p>
                <p className="mt-2">
                  Le droit de rétractation ne s&apos;applique pas :
                </p>
                <ul className="mt-2 list-inside space-y-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  <li>
                    - Aux voyages dont la date de départ est fixée à moins de
                    14 jours après la réservation
                  </li>
                  <li>
                    - Aux prestations d&apos;hébergement, restauration ou
                    loisirs fournies à des dates spécifiques
                  </li>
                  <li>- Aux services de transport non remboursables</li>
                  <li>
                    - Aux contrats complètement exécutés avant la fin du délai
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">5.3 Procédure de rétractation</p>
                <p className="mt-2">
                  La rétractation doit être notifiée par courrier électronique
                  ou courrier recommandé à l&apos;adresse de
                  l&apos;Organisateur avec avis de réception, avant
                  l&apos;expiration du délai de 14 jours.
                </p>
              </div>
              <div>
                <p className="font-semibold">5.4 Remboursement</p>
                <p className="mt-2">
                  En cas de rétractation valide, l&apos;Organisateur
                  rembourse au Client les sommes versées, déduction faite
                  des coûts de gestion administrative (50 euros) et des frais
                  de dossier, dans un délai de 30 jours suivant la
                  rétractation.
                </p>
              </div>
            </div>
          </section>

          {/* Article 6 */}
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
              Article 6 : Annulation par le Client
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">6.1 Modalités d&apos;annulation</p>
                <p className="mt-2">
                  Le Client peut annuler son voyage à tout moment en en
                  informant l&apos;Organisateur par écrit. L&apos;annulation
                  prend effet à la date de réception de la demande.
                </p>
              </div>
              <div>
                <p className="font-semibold">6.2 Barème de dédit</p>
                <p className="mt-2">
                  Les conditions de remboursement dépendent du délai
                  d&apos;annulation antérieur au départ :
                </p>
                <table
                  className="mt-3 w-full border-collapse"
                  style={{ borderColor: '#E5E0D8' }}
                >
                  <caption className="sr-only">Barème des frais d'annulation</caption>
                  <thead>
                    <tr>
                      <th
                        className="p-2 text-left"
                        style={{
                          border: '1px solid #E5E0D8',
                          color: 'var(--navy, #1A1A2E)',
                          fontWeight: 'bold',
                        }}
                      >
                        Délai avant départ
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Frais d&apos;annulation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        className="p-2"
                        style={{
                          border: '1px solid #E5E0D8',
                          color: 'var(--navy, #1A1A2E)',
                        }}
                      >
                        Plus de 60 jours
                      </td>
                      <td className="border border-gray-300 p-2">
                        Acompte forfaitaire retenu (30%)
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="p-2"
                        style={{
                          border: '1px solid #E5E0D8',
                          color: 'var(--navy, #1A1A2E)',
                        }}
                      >
                        30 à 60 jours
                      </td>
                      <td className="border border-gray-300 p-2">50% du prix</td>
                    </tr>
                    <tr>
                      <td
                        className="p-2"
                        style={{
                          border: '1px solid #E5E0D8',
                          color: 'var(--navy, #1A1A2E)',
                        }}
                      >
                        15 à 30 jours
                      </td>
                      <td className="border border-gray-300 p-2">75% du prix</td>
                    </tr>
                    <tr>
                      <td
                        className="p-2"
                        style={{
                          border: '1px solid #E5E0D8',
                          color: 'var(--navy, #1A1A2E)',
                        }}
                      >
                        Moins de 15 jours
                      </td>
                      <td className="border border-gray-300 p-2">100% du prix</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <p className="font-semibold">6.3 Remplacement</p>
                <p className="mt-2">
                  Le Client peut faire remplacer son dossier par une autre
                  personne jusqu&apos;à 15 jours avant le départ, sous
                  réserve de pouvoir justifier son identité. Aucun frais
                  supplémentaire n&apos;est demandé pour ce changement.
                </p>
              </div>
            </div>
          </section>

          {/* Article 7 */}
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
              Article 7 : Annulation par l&apos;Organisateur
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">
                  7.1 Motifs justifiant une annulation
                </p>
                <p className="mt-2">
                  L&apos;Organisateur peut annuler ou reporter un voyage
                  préalablement confirmé dans les cas suivants :
                </p>
                <ul className="mt-2 list-inside space-y-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  <li>
                    - Nombre insuffisant de participants (minimum 10 personnes
                    pour les voyages groupés ; 50% pour les autres voyages)
                  </li>
                  <li>
                    - Cas de force majeure (événements climatiques extrêmes,
                    épidémies, guerres, attentas terroristes, fermetures de
                    frontières)
                  </li>
                  <li>
                    - Défaillance majeure d&apos;un prestataire contractuel
                  </li>
                  <li>- Comportement illégal ou dangereux d&apos;un client</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">
                  7.2 Procédure d&apos;annulation (No-Go)
                </p>
                <p className="mt-2">
                  En cas de No-Go (annulation faute de nombre suffisant de
                  participants), l&apos;Organisateur en informe les Clients
                  au plus tard 45 jours avant la date de départ. Les Clients
                  reçoivent un remboursement intégral des sommes versées
                  sous 30 jours.
                </p>
              </div>
              <div>
                <p className="font-semibold">7.3 Cas de force majeure</p>
                <p className="mt-2">
                  En cas de force majeure intervenant après la confirmation
                  de la réservation, l&apos;Organisateur offre au Client le
                  choix entre :
                </p>
                <ul className="mt-3 list-inside space-y-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  <li>
                    - Un report à une date ultérieure (sans frais
                    supplémentaires)
                  </li>
                  <li>
                    - Un avoir de même valeur, valable 24 mois à compter de
                    l&apos;annulation
                  </li>
                  <li>
                    - Un remboursement intégral, déduction faite des frais de
                    dossier engagés
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">
                  7.4 Modification substantielle du programme
                </p>
                <p className="mt-2">
                  Toute modification substantielle du programme (changement de
                  dates, destination, hôtel de même standing, horaires) est
                  communiquée au Client au plus tôt possible. Le Client peut
                  annuler sans pénalité si la modification est jugée
                  substantielle.
                </p>
              </div>
            </div>
          </section>

          {/* Article 8 */}
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
              Article 8 : Assurance voyage
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">8.1 Assurance recommandée</p>
                <p className="mt-2">
                  L&apos;Organisateur recommande fortement aux Clients de
                  souscrire une assurance voyage couvrant l&apos;annulation,
                  l&apos;assistance médicale et l&apos;interruption de voyage,
                  particulièrement pour les voyages internationaux.
                </p>
              </div>
              <div>
                <p className="font-semibold">8.2 Assurance fournie</p>
                <p className="mt-2">
                  L&apos;Organisateur peut proposer des assurances optionnelles
                  à titre onéreux. Les tarifs, conditions et garanties sont
                  précisés lors de la réservation. L&apos;assurance doit être
                  choisie au moment de la confirmation de la réservation.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  8.3 Non-responsabilité de l&apos;Organisateur
                </p>
                <p className="mt-2">
                  L&apos;Organisateur ne peut être tenu responsable des sinistres
                  non couverts par une assurance, notamment les frais médicaux
                  d&apos;urgence, rapatriement ou décès survenus avant
                  l&apos;assurance travel.
                </p>
              </div>
            </div>
          </section>

          {/* Article 9 */}
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
              Article 9 : Transport
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">9.1 Transport aérien</p>
                <p className="mt-2">
                  Les vols sont effectués par les compagnies aériennes
                  partenaires. Les conditions générales des compagnies
                  aériennes s&apos;appliquent (surclassement, annulation,
                  retard). L&apos;Organisateur ne peut être tenu responsable
                  des modifications ou annulations de vols décidées par les
                  compagnies aériennes.
                </p>
                <p className="mt-2">
                  La responsabilité du transporteur aérien est soumise aux
                  conventions internationales applicables.
                </p>
              </div>
              <div>
                <p className="font-semibold">9.2 Autres transports</p>
                <p className="mt-2">
                  Les transports terrestres (car, train) sont organisés par des
                  prestataires partenaires. L&apos;Organisateur décline toute
                  responsabilité pour les retards, accidents ou défaillances
                  techniques.
                </p>
              </div>
              <div>
                <p className="font-semibold">9.3 Horaires</p>
                <p className="mt-2">
                  Les horaires indiqués dans les documents du voyage sont
                  donnés à titre informatif. L&apos;Organisateur ne peut
                  garantir le respect strict des horaires et ne peut être tenu
                  responsable des retards.
                </p>
              </div>
            </div>
          </section>

          {/* Article 10 */}
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
              Article 10 : Hébergement
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">10.1 Qualité et standing</p>
                <p className="mt-2">
                  Les hôtels et logements sont sélectionnés selon le niveau de
                  confort et de standing indiqué dans la description du voyage.
                  Les établissements peuvent être modifiés si l&apos;hôtel
                  prévisionnel devient indisponible, sous réserve de proposer un
                  établissement de même standing.
                </p>
              </div>
              <div>
                <p className="font-semibold">10.2 Services et équipements</p>
                <p className="mt-2">
                  Les services mentionnés dans le descriptif du voyage sont
                  considérés comme fournis par les hôtels partenaires. Tout
                  service non fourni doit être signalé à
                  l&apos;Organisateur dès la découverte du problème.
                </p>
              </div>
              <div>
                <p className="font-semibold">10.3 Responsabilité</p>
                <p className="mt-2">
                  L&apos;Organisateur décline toute responsabilité concernant
                  les conditions de propreté, confort ou sécurité des logements.
                  Le Client demeure responsable de l&apos;intégrité de sa
                  chambre et du respect du règlement intérieur des
                  établissements.
                </p>
              </div>
            </div>
          </section>

          {/* Article 11 */}
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
              Article 11 : Responsabilité
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">11.1 Limitation de responsabilité</p>
                <p className="mt-2">
                  La responsabilité de l&apos;Organisateur est limitée à
                  l&apos;exécution des prestations conformes aux conditions du
                  contrat. L&apos;Organisateur ne peut être tenu responsable :
                </p>
                <ul className="mt-2 list-inside space-y-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  <li>
                    - Des préjudices indirects (perte de revenus, manquement à
                    engagement)
                  </li>
                  <li>
                    - Des défaillances de prestataires tiers (hôtels, compagnies
                    aériennes)
                  </li>
                  <li>
                    - Des cas de force majeure ou événements imprévisibles
                  </li>
                  <li>
                    - Des refus d&apos;embarquement ou d&apos;entrée (documentation,
                    health pass)
                  </li>
                  <li>
                    - Des incidents dus au comportement du Client
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">11.2 Responsabilité des bagages</p>
                <p className="mt-2">
                  Le Client est responsable de ses bagages et effets personnels.
                  L&apos;Organisateur n&apos;assume aucune assurance concernant
                  les pertes, vols ou dégâts. Le Client est invité à souscrire
                  une assurance valises et bagages.
                </p>
              </div>
              <div>
                <p className="font-semibold">11.3 Responsabilité civile</p>
                <p className="mt-2">
                  L&apos;Organisateur souscrit une assurance de responsabilité
                  civile couvrant les dommages causés aux Clients résultant de
                  fautes commises par l&apos;Organisateur ou ses préposés.
                </p>
              </div>
            </div>
          </section>

          {/* Article 12 */}
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
              Article 12 : Réclamations
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">12.1 Procédure de réclamation</p>
                <p className="mt-2">
                  Tout manquement aux prestations promises doit être signalé
                  immédiatement à un représentant de l&apos;Organisateur sur
                  place (guide, accompagnateur) afin de pouvoir y remédier.
                </p>
              </div>
              <div>
                <p className="font-semibold">12.2 Réclamation écrite</p>
                <p className="mt-2">
                  Les réclamations écrites doivent être adressées à
                  l&apos;Organisateur par courrier recommandé ou email dans un
                  délai de 30 jours suivant la fin du voyage, accompagnées de
                  toutes pièces justificatives (factures, photographies,
                  témoignages).
                </p>
              </div>
              <div>
                <p className="font-semibold">12.3 Délai de traitement</p>
                <p className="mt-2">
                  L&apos;Organisateur examine toute réclamation et se prononce
                  dans un délai de 45 jours. En cas d&apos;insatisfaction, le
                  Client peut saisir un tiers médiateur.
                </p>
              </div>
            </div>
          </section>

          {/* Article 13 */}
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
              Article 13 : Protection des données personnelles
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                Le traitement des données personnelles des Clients est régi par
                la Politique de Confidentialité disponible à{' '}
                <Link
                  href="/politique-confidentialite"
                  style={{ color: 'var(--terra, #C75B39)' }}
                  className="hover:underline"
                >
                  /politique-confidentialite
                </Link>
                , conforme au Règlement Général sur la Protection des Données
                (RGPD) et à la loi française Informatique et Libertés.
              </p>
              <p>
                Les données sont nécessaires pour l&apos;organisation du voyage
                (réservation transport, hôtels, assurance) et la gestion
                administrative.
              </p>
            </div>
          </section>

          {/* Article 14 */}
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
              Article 14 : Médiation
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <div>
                <p className="font-semibold">14.1 Tentative préalable</p>
                <p className="mt-2">
                  Avant d&apos;engager toute action en justice, le Client
                  s&apos;engage à rechercher une résolution amiable en
                  contactant directement l&apos;Organisateur.
                </p>
              </div>
              <div>
                <p className="font-semibold">14.2 Recours à un médiateur</p>
                <p className="mt-2">
                  En cas de différend persistant, le Client peut saisir un
                  médiateur professionnel agréé. Les coordonnées du médiateur
                  sont fournies sur demande.
                </p>
              </div>
              <div>
                <p className="font-semibold">14.3 Frais de médiation</p>
                <p className="mt-2">
                  La médiation est gratuite pour le Client. Les frais de
                  médiateur sont assumés par l&apos;Organisateur en cas de
                  résolution favorable au Client.
                </p>
              </div>
            </div>
          </section>

          {/* Article 15 */}
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
              Article 15 : Droit applicable et juridiction
            </h2>
            <div className="space-y-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <p>
                <strong>Droit applicable :</strong> Les présentes CGV sont
                régies par la loi française, notamment par les articles L.211-4
                et suivants du Code du tourisme.
              </p>
              <p>
                <strong>Juridiction :</strong> Tout différend non résolu par
                voie de médiation sera de la compétence exclusive des tribunaux
                français, siège du siège social de l&apos;Organisateur (Tribunal
                de Grande Instance de Paris).
              </p>
              <p>
                Le Client peut également saisir tout tribunal compétent du lieu
                de son domicile.
              </p>
            </div>
          </section>

          {/* Final note */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--cream, #FAF7F2)',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
              <strong>Dernière mise à jour :</strong> 2 mars 2026
            </p>
            <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
              Ces Conditions Générales de Vente sont conformes aux exigences du
              Code du tourisme français et des directives européennes sur les
              voyages à forfait.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
