import type { Metadata } from 'next';
import './globals.css';
import Tabs from './Tabs';

export const metadata: Metadata = {
  title: 'Artifact Type Preview',
  description: 'Document type classification preview',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <div className="p-6 max-w-screen-2xl mx-auto font-sans">
          <h1 className="text-xl font-semibold mb-5 text-gray-800">Artifact Type Preview</h1>
          <Tabs />
          {children}
        </div>
      </body>
    </html>
  );
}
