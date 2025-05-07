import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'PhoneKlinik',
  description: 'Phone repair service website.',
  /*   icons: {
    icon: '/favicon.ico',
  }, */
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <main className="flex flex-col grow px-[12%] min-h-screen py-10">
          {children}
        </main>{' '}
        <Footer />
      </body>
    </html>
  );
}
