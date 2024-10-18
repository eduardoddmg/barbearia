import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Providers from './providers';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Navbar } from '@/components/navbar';

// Carregando as fontes locais
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// Metadados de SEO otimizados
export const metadata: Metadata = {
  title: 'Sistema de Agendamento de Cortes - Barbearia',
  description:
    'Agende cortes de cabelo facilmente com o nosso sistema de agendamento online para barbeiros. Organize horários e clientes de maneira eficiente.',
  keywords:
    'agendamento de cortes, sistema de barbearia, barbeiro, cortes de cabelo, gestão de clientes, agendamento online',
  openGraph: {
    title: 'Sistema de Agendamento de Cortes - Barbearia',
    description:
      'Agende cortes de cabelo facilmente com o nosso sistema de agendamento online para barbeiros. Organize horários e clientes de maneira eficiente.',
    url: 'https://www.seu-dominio.com', // Substitua pelo domínio real
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Adicionando ícones */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="p-4">{children}</div>
          </ThemeProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
