import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ready | Questionnaire & Career Diagnostic Portal',
  description: 'AI-driven student questionnaire, career path matching, READY diagnostic report for mentors, and admin dashboard.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
