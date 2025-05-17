import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'PhoneKlinik',
  description:
    'iPhone, iPad, Samsung Galaxy og Google Pixel reparation i København. Mobiltilbehør og hurtig service – besøg PhoneKlinik i dag.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Toaster richColors={true} position="top-right" />
        <main className="flex flex-col grow px-[12%] min-h-screen py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
