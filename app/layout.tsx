import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const chetta = localFont({
  src: "../public/fonts/ChettaVissto.ttf",
  variable: "--font-chetta",
  display: "swap",
});

const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "tperry | Designer",
  description: "Motion Designer • Graphics Artist • Video Editor",
  icons: {
    icon: "/tperry-avatar.jpeg",
    apple: "/tperry-avatar.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chetta.variable} ${syne.variable} ${spaceGrotesk.variable} antialiased`}>
        {children}
        {/* Film Grain Overlay */}
        <div className="grain" />
      </body>
    </html>
  );
}
