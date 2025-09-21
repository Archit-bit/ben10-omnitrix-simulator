import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Ben 10 Omnitrix Simulator",
  description: "Interactive Ben 10 Omnitrix Simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} font-orbitron antialiased bg-omnitrix-black text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
