import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'GearUp | Equipment Rental Platform',
  description: 'Rent certified commercial equipment, cinema gear, agriculture machinery, and construction tools with instant Stripe checkout.',
  keywords: 'equipment rental, machinery rental, construction gear, cinema camera rent, tractor rental, tools marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-base-100 text-base-content">
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'var(--fallback-b1,oklch(var(--b1)/1))',
                  color: 'var(--fallback-bc,oklch(var(--bc)/1))',
                  borderRadius: '1rem',
                  border: '1px solid var(--fallback-b3,oklch(var(--b3)/0.5))',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
