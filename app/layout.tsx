import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
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
      <body className={`${poppins.variable} antialiased`}>
        {children}
        {/* Film Grain Overlay */}
        <div className="grain" />
      </body>
    </html>
  );
}
