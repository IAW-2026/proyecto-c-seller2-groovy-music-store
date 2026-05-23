import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { cormorant, syne, dmSans } from "@/app/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Groovy Music Store — Vendedores",
  description: "Panel de vendedores de Groovy Music Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="es"
        className={`${cormorant.variable} ${syne.variable} ${dmSans.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
