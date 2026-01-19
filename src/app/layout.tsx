import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomizationProvider } from "@/lib/hooks/useCustomization";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "yT3 Chat",
  description: "A comfy, customizable YouTube Live Chat viewer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        <CustomizationProvider>
          {children}
        </CustomizationProvider>
      </body>
    </html>
  );
}
