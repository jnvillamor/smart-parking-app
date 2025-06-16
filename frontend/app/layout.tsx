import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: { 
    default: 'SmartPark - Real-Time Parking Solutions',
    template: '%s | SmartPark'
  },
  description: 'This is a smart parking system that allows users to find and reserve parking spots in real-time.',
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster richColors position='bottom-center' />
      </body>
    </html>
  );
}
