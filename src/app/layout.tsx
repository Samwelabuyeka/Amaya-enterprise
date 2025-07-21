import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Amaya',
  description: 'Discover and connect with global brands',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-black">
        <header className="p-4 bg-black text-white flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Amaya</Link>
          <nav className="space-x-4">
            <Link href="/">Home</Link>
            <Link href="/(home)/brands">Brands</Link>
            <Link href="/(home)/products">Products</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
