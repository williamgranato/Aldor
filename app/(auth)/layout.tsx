'use client';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
