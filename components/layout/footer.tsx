'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Footer global — Design Eventy v2
 * Navy bg, logo Playfair, colonnes cream
 */
export function Footer() {
  return (
    <footer style={{ background: 'var(--navy, #1A1A2E)', color: 'rgba(250,247,242,0.7)' }} className="mt-16" role="contentinfo" aria-label="Pied de page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top — Logo + Tagline */}
        <div className="mb-10">
          <div className="flex items-center gap-0 mb-3">
            <span className="font-display text-2xl font-bold" style={{ color: 'var(--cream, #FAF7F2)' }}>
              Eventy
            </span>
            <span className="font-display text-2xl font-bold" style={{ color: 'var(--gold, #D4A853)' }}>
              .
            </span>
            <span className="font-display text-2xl font-bold" style={{ color: 'var(--cream, #FAF7F2)' }}>
              Life
            </span>
          </div>
          <p className="text-sm max-w-md" style={{ color: 'rgba(250,247,242,0.5)' }}>
            Voyages de groupe avec accompagnement humain porte-à-porte.
            Prix justes, qualité garantie.
          </p>
        </div>

        {/* Colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* À propos */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--gold, #D4A853)' }}>
              À propos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/a-propos" className="text-sm hover:text-white transition-colors duration-200">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link href="/a-propos#mission" className="text-sm hover:text-white transition-colors duration-200">
                  Notre mission
                </Link>
              </li>
              <li>
                <Link href="/a-propos#carrieres" className="text-sm hover:text-white transition-colors duration-200">
                  Carrières
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-white transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Découvrir */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--gold, #D4A853)' }}>
              Découvrir
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/voyages" className="text-sm hover:text-white transition-colors duration-200">
                  Tous les voyages
                </Link>
              </li>
              <li>
                <Link href="/comment-ca-marche" className="text-sm hover:text-white transition-colors duration-200">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/depart" className="text-sm hover:text-white transition-colors duration-200">
                  Points de départ
                </Link>
              </li>
              <li>
                <Link href="/avis" className="text-sm hover:text-white transition-colors duration-200">
                  Avis voyageurs
                </Link>
              </li>
              <li>
                <Link href="/partenaires" className="text-sm hover:text-white transition-colors duration-200">
                  Devenir partenaire
                </Link>
              </li>
              <li>
                <Link href="/brochure" className="text-sm hover:text-white transition-colors duration-200">
                  Brochure
                </Link>
              </li>
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--gold, #D4A853)' }}>
              Aide
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-sm hover:text-white transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors duration-200">
                  Support client
                </Link>
              </li>
              <li>
                <Link href="/suivi-commande" className="text-sm hover:text-white transition-colors duration-200">
                  Suivre ma réservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--gold, #D4A853)' }}>
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+33123456789" className="text-sm hover:text-white transition-colors duration-200">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li>
                <a href="mailto:contact@eventylife.fr" className="text-sm hover:text-white transition-colors duration-200">
                  contact@eventylife.fr
                </a>
              </li>
              <li>
                <span className="text-sm" style={{ color: 'rgba(250,247,242,0.4)' }}>
                  Paris, France
                </span>
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <div className="flex gap-4 mt-5">
              <a
                href="https://facebook.com/eventylife"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-white"
                aria-label="Facebook Eventy Life"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/eventylife"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-white"
                aria-label="Instagram Eventy Life"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@eventylife"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-white"
                aria-label="TikTok Eventy Life"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43v-7.15a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-2-.52V6.69h2z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@eventylife"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-white"
                aria-label="YouTube Eventy Life"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider + Legal */}
        <div style={{ borderTop: '1px solid rgba(250,247,242,0.1)' }} className="pt-8">
          <div className="flex flex-wrap gap-4 mb-6 justify-center text-xs" style={{ color: 'rgba(250,247,242,0.4)' }}>
            <Link href="/cgv" className="hover:text-white transition-colors duration-200">
              CGV
            </Link>
            <span>·</span>
            <Link href="/mentions-legales" className="hover:text-white transition-colors duration-200">
              Mentions légales
            </Link>
            <span>·</span>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors duration-200">
              Confidentialité
            </Link>
            <span>·</span>
            <Link href="/cookies" className="hover:text-white transition-colors duration-200">
              Cookies
            </Link>
          </div>

          <p className="text-center text-xs" style={{ color: 'rgba(250,247,242,0.3)' }}>
            &copy; {new Date().getFullYear()} Eventy Life SAS — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
