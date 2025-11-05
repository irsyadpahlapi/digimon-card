import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login digimon',
  description: 'Aplication Login Digimon cards',
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
