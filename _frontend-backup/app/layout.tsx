import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkTape",
  description: "Turn recorded manual work into a spec-driven internal tool."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
