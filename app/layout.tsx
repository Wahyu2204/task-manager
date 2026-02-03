import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetBrains_Mono = JetBrains_Mono({
  variable: "--font-jetbrains_Mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SudoDo - Task Manager for All",
  description: "Kelola tugas kuliah lo biar gak numpuk."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetBrains_Mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
