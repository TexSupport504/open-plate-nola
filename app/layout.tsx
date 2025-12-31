import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open Plate NOLA",
  description: "Free food resources across New Orleans. No ID, no signup, no questions asked.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
