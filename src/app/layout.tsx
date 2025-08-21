import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import AuthButton from "./login/AuthButton";

export const metadata: Metadata = { title: "Career Copilot Enterprise", description: "Commercial AI Resume & Interview platform" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
          <nav className="max-w-6xl mx-auto p-4 flex items-center gap-6">
            <Link href="/" className="font-semibold">Career Copilot</Link>
            <Link href="/resume">Resume</Link>
            <Link href="/interview">Interview</Link>
            <Link href="/pricing">Pricing</Link>
            <div className="ml-auto"><AuthButton /></div>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto p-6">{children}</main>
        <footer className="border-t mt-16 bg-white">
          <div className="max-w-6xl mx-auto p-6 text-sm text-gray-500 flex justify-between">
            <span>© {new Date().getFullYear()} Career Copilot</span>
            <div className="space-x-4">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
