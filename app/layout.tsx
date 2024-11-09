import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { ChatProvider } from "@/providers/ChatProvider";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { Providers } from "@/providers/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "College Management App: Campus Connect",
  description: "College Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
        <AuthProvider>
          <ChatProvider>
           <NavBar />
            {children}
            </ChatProvider>
        </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
