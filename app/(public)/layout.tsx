import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackToTop } from '@/components/ui/back-to-top';

// Note: This layout provides default metadata for public pages
// Individual pages may override this with their own metadata in layout files

// Metadata inherited from root layout (app/layout.tsx).
// Individual public pages override via their own layout.tsx files.

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
