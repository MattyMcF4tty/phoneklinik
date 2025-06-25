import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import Navbar from '@/components/navbars/Navbar';
import AdminNavbar from '@components/navbars/AdminNavbar';
import { getPathnameFromHeaders } from '@utils/misc';

export const metadata: Metadata = {
  title: 'PhoneKlinik',
  description:
    'iPhone, iPad, Samsung Galaxy og Google Pixel reparation i København. Mobiltilbehør og hurtig service – besøg PhoneKlinik i dag.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = await getPathnameFromHeaders();

  const underMaintenance = pathname.includes('maintenance');
  return (
    <html lang="da" className="h-full">
      <body className="bg-slate-50 min-h-screen flex flex-col">
        <Toaster richColors={true} position="top-right" />
        {pathname.includes('admin') ? (
          <AdminNavbar />
        ) : !underMaintenance ? (
          <Navbar />
        ) : null}
        <main className="relative flex flex-col grow min-h-screen ">
          <div className="flex flex-col grow pt-[calc(var(--navbar-height)_+_2.5rem)] pb-[2.5rem] px-[12%]">
            {children}
          </div>
        </main>
        {!underMaintenance ? <Footer /> : null}
      </body>
    </html>
  );
}
