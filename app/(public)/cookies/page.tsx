import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Cookies | Eventy Life',
  description:
    'Politique de cookies d\'Eventy Life - Gestion des cookies et traceurs',
};

export default function CookiesPolicy() {
  const cookies = [
    {
      name: 'session_id',
      category: 'Essentiels',
      purpose: 'Maintenir votre session utilisateur',
      duration: '24 heures',
      provider: 'Eventy Life',
    },
    {
      name: 'auth_token',
      category: 'Essentiels',
      purpose: 'Authentification et sécurité',
      duration: '30 jours',
      provider: 'Eventy Life',
    },
    {
      name: 'cookie_consent',
      category: 'Essentiels',
      purpose: 'Enregistrer vos préférences de cookies',
      duration: '12 mois',
      provider: 'Eventy Life',
    },
    {
      name: '_ga',
      category: 'Analytics',
      purpose: 'Analyser le comportement des visiteurs',
      duration: '2 ans',
      provider: 'Google Analytics',
    },
    {
      name: '_gid',
      category: 'Analytics',
      purpose: 'Identifier les sessions utilisateur',
      duration: '24 heures',
      provider: 'Google Analytics',
    },
    {
      name: 'user_preferences',
      category: 'Fonctionnels',
      purpose: 'Mémoriser vos préférences (langue, affichage)',
      duration: '12 mois',
      provider: 'Eventy Life',
    },
    {
      name: 'search_history',
      category: 'Fonctionnels',
      purpose: 'Améliorer la pertinence des résultats de recherche',
      duration: '3 mois',
      provider: 'Eventy Life',
    },
    {
      name: 'fbp',
      category: 'Marketing',
      purpose: 'Publicités ciblées Facebook',
      duration: '90 jours',
      provider: 'Facebook',
    },
    {
      name: '_ttp',
      category: 'Marketing',
      purpose: 'Publicités ciblées TikTok',
      duration: '1 an',
      provider: 'TikTok',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Politique de Cookies
          </h1>
          <p className="text-lg text-gray-600">
            Gestion des cookies et technologies de suivi
          </p>
          <p className="mt-2 text-sm text-gray-500">
            En vigueur à compter du 2 mars 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section className="rounded-lg border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Qu&apos;est-ce qu&apos;un cookie ?
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Un cookie est un petit fichier texte stocké sur votre appareil
                (ordinateur, smartphone, tablette) lors de la visite d&apos;un
                site Internet. Il permet à ce site de mémoriser des informations
                sur votre visite (identifiant de session, préférences, historique).
              </p>
              <p>
                Les cookies peuvent être :
              </p>
              <ul className="list-inside space-y-1">
                <li>
                  <strong>Cookies de session :</strong> Supprimés à la fermeture
                  du navigateur
                </li>
                <li>
                  <strong>Cookies persistants :</strong> Restent stockés pour
                  une durée définie
                </li>
                <li>
                  <strong>Cookies propriétaires :</strong> Créés par Eventy Life
                </li>
                <li>
                  <strong>Cookies tiers :</strong> Créés par des partenaires
                </li>
              </ul>
            </div>
          </section>

          {/* Types de cookies */}
          <section className="rounded-lg border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Types de cookies utilisés
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  1. Cookies essentiels / strictement nécessaires
                </h3>
                <p className="mb-3">
                  Ces cookies sont nécessaires au fonctionnement du site. Ils
                  permettent les fonctionnalités basiques comme la sécurité,
                  l&apos;authentification et la mémorisation de vos choix.
                </p>
                <p className="text-sm">
                  <strong>Status :</strong> Activés par défaut, ne peuvent pas
                  être désactivés
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  2. Cookies d&apos;analyse (Analytics)
                </h3>
                <p className="mb-3">
                  Ces cookies nous aident à comprendre comment les visiteurs
                  utilisent le site (pages visitées, durée de visite, interactions).
                  Nous utilisons Google Analytics pour l&apos;analyse.
                </p>
                <p className="text-sm">
                  <strong>Status :</strong> Activés avec votre consentement
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  3. Cookies fonctionnels
                </h3>
                <p className="mb-3">
                  Ces cookies mémorisent vos préférences et paramètres
                  (langue, paramètres d&apos;affichage, historique de recherche)
                  pour améliorer votre expérience lors de futures visites.
                </p>
                <p className="text-sm">
                  <strong>Status :</strong> Activés avec votre consentement
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  4. Cookies marketing / de reciblage
                </h3>
                <p className="mb-3">
                  Ces cookies permettent aux réseaux sociaux et aux plateformes
                  publicitaires (Facebook, TikTok, Google Ads) de vous afficher
                  des annonces personnalisées basées sur votre comportement de
                  navigation.
                </p>
                <p className="text-sm">
                  <strong>Status :</strong> Activés avec votre consentement
                </p>
              </div>
            </div>
          </section>

          {/* Tableau des cookies */}
          <section className="rounded-lg border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Tableau détaillé des cookies
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-3 text-left">Nom</th>
                    <th className="border border-gray-300 p-3 text-left">
                      Catégorie
                    </th>
                    <th className="border border-gray-300 p-3 text-left">Finalité</th>
                    <th className="border border-gray-300 p-3 text-left">Durée</th>
                    <th className="border border-gray-300 p-3 text-left">
                      Fournisseur
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cookies.map((cookie, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-3">
                        <code className="text-xs font-mono">{cookie.name}</code>
                      </td>
                      <td className="border border-gray-300 p-3">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                            cookie.category === 'Essentiels'
                              ? 'bg-green-100 text-green-800'
                              : cookie.category === 'Analytics'
                                ? 'bg-blue-100 text-blue-800'
                                : cookie.category === 'Fonctionnels'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cookie.category}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3">
                        {cookie.purpose}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {cookie.duration}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {cookie.provider}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Gestion des cookies */}
          <section className="rounded-lg border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Comment gérer les cookies
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-semibold">Option 1 : Banneau de consentement</p>
                <p className="mt-2">
                  À votre première visite, un banneau de consentement s&apos;affiche
                  en bas du site. Vous pouvez :
                </p>
                <ul className="mt-2 list-inside space-y-1">
                  <li>- Accepter tous les cookies</li>
                  <li>- Refuser les cookies non-essentiels</li>
                  <li>- Personnaliser vos préférences</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Option 2 : Paramètres du navigateur</p>
                <p className="mt-2">
                  Vous pouvez configurer votre navigateur pour :
                </p>
                <ul className="mt-2 list-inside space-y-1">
                  <li>
                    - Bloquer tous les cookies ou seulement les cookies tiers
                  </li>
                  <li>
                    - Activer le mode de navigation privée / incognito
                  </li>
                  <li>
                    - Supprimer les cookies stockés à la fermeture du navigateur
                  </li>
                  <li>
                    - Recevoir une alerte lors du dépôt de cookies
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Option 3 : Outils de désinscription</p>
                <p className="mt-2">
                  Vous pouvez vous désinscrire des cookies marketing spécifiques :
                </p>
                <ul className="mt-2 list-inside space-y-1">
                  <li>
                    - Google Analytics :{' '}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Google Analytics Opt-out
                    </a>
                  </li>
                  <li>
                    - Facebook :{' '}
                    <a
                      href="https://www.facebook.com/ads/preferences/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Centre de préférences Facebook
                    </a>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">
                  Important : Désactiver les cookies essentiels peut affecter le
                  fonctionnement du site et votre expérience utilisateur.
                </p>
              </div>
            </div>
          </section>

          {/* Traceurs */}
          <section className="rounded-lg border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Autres technologies de suivi
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-semibold">Pixels de suivi</p>
                <p className="mt-2">
                  Des pixels invisibles peuvent être intégrés à nos emails pour
                  mesurer les taux d&apos;ouverture et de clic.
                </p>
              </div>

              <div>
                <p className="font-semibold">LocalStorage et SessionStorage</p>
                <p className="mt-2">
                  Ces technologies stockent les données directement dans votre
                  navigateur, similaires aux cookies mais avec une capacité
                  supérieure.
                </p>
              </div>

              <div>
                <p className="font-semibold">Web Beacons</p>
                <p className="mt-2">
                  Petits éléments graphiques invisibles permettant le suivi des
                  interactions avec les contenus.
                </p>
              </div>
            </div>
          </section>

          {/* Partenaires */}
          <section className="rounded-lg border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Nos partenaires et prestataires
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Nous travaillons avec les partenaires suivants qui peuvent
                placer des cookies :
              </p>
              <ul className="list-inside space-y-2">
                <li>
                  <strong>Google Analytics :</strong> Analyse du comportement
                  des visiteurs
                </li>
                <li>
                  <strong>Google Ads :</strong> Annonces personnalisées
                </li>
                <li>
                  <strong>Facebook Pixel :</strong> Reciblage publicitaire
                </li>
                <li>
                  <strong>TikTok Pixel :</strong> Reciblage publicitaire
                </li>
                <li>
                  <strong>Hotjar :</strong> Analyse d&apos;expérience utilisateur
                </li>
              </ul>
              <p className="mt-4 text-sm">
                Pour consulter les politiques de confidentialité de ces tiers,
                veuillez visiter leurs sites respectifs.
              </p>
            </div>
          </section>

          {/* Droits */}
          <section className="rounded-lg border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Vos droits
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Conformément au RGPD et à la loi Informatique et Libertés, vous avez
                le droit de :
              </p>
              <ul className="list-inside space-y-2">
                <li>
                  - Retirer votre consentement aux cookies à tout moment
                </li>
                <li>
                  - Demander l&apos;accès aux données collectées via les cookies
                </li>
                <li>
                  - Demander la suppression de vos données
                </li>
                <li>
                  - Obtenir une explication sur l&apos;utilisation des cookies
                </li>
                <li>
                  - Déposer une réclamation auprès de la CNIL
                </li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, veuillez consulter notre{' '}
                <Link
                  href="/politique-confidentialite"
                  className="text-blue-600 hover:underline"
                >
                  Politique de Confidentialité
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-lg border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Nous contacter
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                Pour toute question concernant cette Politique de Cookies :
              </p>
              <p>
                <strong>Email :</strong>{' '}
                <a
                  href="mailto:dpo@eventy.life"
                  className="text-blue-600 hover:underline"
                >
                  dpo@eventy.life
                </a>
              </p>
              <p>
                <strong>Adresse :</strong> 15 rue de la Paix, 75002 Paris, France
              </p>
            </div>
          </section>

          {/* Final note */}
          <div className="rounded-lg bg-blue-50 p-6">
            <p className="text-sm text-gray-700">
              <strong>Dernière mise à jour :</strong> 2 mars 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
