import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EchoPersona - AI Customer Service Revolution",
  description:
    "Replace traditional customer service calls with intelligent AI agents. Speech-to-Speech communication powered by advanced AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-charcoal text-white min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
