import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PhoneKlinik - Auth',
  description: 'Adgang til PhoneKliniks administrationspanel.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-blue-400 absolute w-screen h-screen left-0 top-0 items-center flex justify-center">
      {children}
    </div>
  );
}
