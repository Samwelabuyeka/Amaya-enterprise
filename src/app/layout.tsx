// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Amaya',
  description: 'Discover and connect with global brands across fashion, beauty, tech, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans">
        <header className="bg-white shadow sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-black hover:text-indigo-600">
              Amaya
            </Link>
            <nav className="space-x-6">
              <Link href="/" className="hover:text-indigo-500">Home</Link>
              <Link href="/(home)/brands" className="hover:text-indigo-500">Brands</Link>
              <Link href="/(home)/products" className="hover:text-indigo-500">Products</Link>
              <Link href="/admin" className="hover:text-indigo-500">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
