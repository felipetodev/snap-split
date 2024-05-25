import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snap Split",
  description: "Snap Split es una aplicación que te ayuda a dividir cuentas de manera rápida y sencilla.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
