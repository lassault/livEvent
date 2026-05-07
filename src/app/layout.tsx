import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "livEvent",
  description:
    "Aplicación para gestión de eventos y red social para promoción de artistas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
