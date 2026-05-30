import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ErrorBoundary } from "./ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import AuthGate from "./components/AuthGate";
import AdminNavLink from "./components/AdminNavLink";
import AdminMobileNavLink from "./components/AdminMobileNavLink";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prode Premium - Remises Bruno",
  description: "Plataforma premium de predicciones de Remises Bruno.",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050508",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050508] text-white pb-16 sm:pb-0 relative overflow-x-hidden">
        {/* Glows ambientales de firma */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-glow-radial-1 -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-glow-radial-2 -z-10 pointer-events-none" />

        {/* Capturador de errores globales de JS para móviles */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                var container = document.getElementById('mobile-global-error');
                if (!container) {
                  container = document.createElement('div');
                  container.id = 'mobile-global-error';
                  container.style.position = 'fixed';
                  container.style.top = '0';
                  container.style.left = '0';
                  container.style.right = '0';
                  container.style.background = '#800';
                  container.style.color = '#fff';
                  container.style.padding = '15px';
                  container.style.zIndex = '999999';
                  container.style.fontFamily = 'monospace';
                  container.style.fontSize = '12px';
                  container.style.overflow = 'auto';
                  container.style.maxHeight = '50vh';
                  container.style.borderBottom = '3px solid #ff0000';
                  document.body.appendChild(container);
                }
                container.innerHTML = '<h3 style="margin:0 0 5px 0;color:#ff3b30">⚠️ ERROR CAPTURADO EN MÓVIL:</h3>' + 
                                      '<p style="margin:0 0 5px 0;font-weight:bold">' + e.message + '</p>' +
                                      '<p style="margin:0;font-size:10px;color:#ccc">' + e.filename + ':' + e.lineno + '</p>' +
                                      '<pre style="margin:5px 0 0 0;font-size:10px;background:#000;padding:5px;overflow:auto">' + (e.error ? e.error.stack : '') + '</pre>';
              });
              window.addEventListener('unhandledrejection', function(e) {
                var container = document.getElementById('mobile-global-error');
                if (!container) {
                  container = document.createElement('div');
                  container.id = 'mobile-global-error';
                  container.style.position = 'fixed';
                  container.style.top = '0';
                  container.style.left = '0';
                  container.style.right = '0';
                  container.style.background = '#800';
                  container.style.color = '#fff';
                  container.style.padding = '15px';
                  container.style.zIndex = '999999';
                  container.style.fontFamily = 'monospace';
                  container.style.fontSize = '12px';
                  container.style.overflow = 'auto';
                  container.style.maxHeight = '50vh';
                  container.style.borderBottom = '3px solid #ff0000';
                  document.body.appendChild(container);
                }
                container.innerHTML = '<h3 style="margin:0 0 5px 0;color:#ff3b30">⚠️ PROMESA RECHAZADA:</h3>' + 
                                      '<p style="margin:0 0 5px 0;font-weight:bold">' + e.reason + '</p>';
              });
            `
          }}
        />
        <AuthProvider>
          <AuthGate>
            <header className="sticky top-0 z-50 bg-[#0c0d14]/80 backdrop-blur-md border-b border-[rgba(212,175,55,0.15)] px-4 sm:px-8 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#f3e5ab] to-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)] overflow-hidden">
                  <img src="/Logo.jpg" alt="Logo Remises Bruno" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="silver-text-gradient font-extrabold text-lg leading-tight tracking-wide">BRUNO</span>
                  <span className="gold-text-gradient text-[10px] font-bold tracking-widest uppercase">REMISES EXECUTIVES</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <nav className="hidden sm:flex items-center gap-8 mr-4">
                  <Link href="/" className="text-gray-400 hover:text-[#d4af37] font-semibold uppercase tracking-wider text-xs transition-colors">Partidos</Link>
                  <Link href="/ranking" className="text-gray-400 hover:text-[#d4af37] font-semibold uppercase tracking-wider text-xs transition-colors">Ranking</Link>
                  <Link href="/premios" className="text-gray-400 hover:text-[#d4af37] font-semibold uppercase tracking-wider text-xs transition-colors">Premios</Link>
                  <Link href="/perfil" className="text-gray-400 hover:text-[#d4af37] font-semibold uppercase tracking-wider text-xs transition-colors">Perfil</Link>
                  <AdminNavLink />
                </nav>
                <div className="text-[#d4af37] opacity-80 animate-pulse">
                  <span className="text-xl font-black italic tracking-tighter">{`>>>`}</span>
                </div>
              </div>
            </header>
 
            <main className="flex-1 w-full max-w-md sm:max-w-2xl mx-auto p-4 sm:p-8 flex flex-col z-10">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
 
            <footer className="w-full text-center py-6 pb-20 sm:pb-8 flex flex-col items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity relative z-10 border-t border-white/5 mt-auto">
              <a 
                href="https://rzcore.dev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 group transition-all"
              >
                <img 
                  src="/Isologo.png" 
                  alt="RzCore Logo" 
                  className="w-6 h-6 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-[#d4af37] transition-colors">
                  Desarrollado por <span className="text-white font-extrabold group-hover:text-[#d4af37]">RzCore</span>
                </span>
              </a>
            </footer>

            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0c0d14]/90 backdrop-blur-md border-t border-[rgba(212,175,55,0.15)] sm:hidden z-50">
              <div className="flex justify-around items-center h-full max-w-md mx-auto">
                <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#d4af37] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                  <span className="text-[9px] font-semibold uppercase tracking-wider">Partidos</span>
                </Link>
                <Link href="/ranking" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#d4af37] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 11.2-2 2.5-3-3"/><path d="m8 18.2-2 2.5-3-3"/><path d="m8 4.2-2 2.5-3-3"/><path d="M14 12h6"/><path d="M14 19h6"/><path d="M14 5h6"/></svg>
                  <span className="text-[9px] font-semibold uppercase tracking-wider">Ranking</span>
                </Link>
                <Link href="/premios" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#d4af37] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                  <span className="text-[9px] font-semibold uppercase tracking-wider">Premios</span>
                </Link>
                <Link href="/perfil" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#d4af37] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span className="text-[9px] font-semibold uppercase tracking-wider">Perfil</span>
                </Link>
                <AdminMobileNavLink />
              </div>
            </nav>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
