import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CustomizationProvider } from "@/lib/hooks/useCustomization";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YT_Chat",
  description: "A comfy, customizable YouTube Live Chat viewer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomizationProvider>
          {children}
        </CustomizationProvider>
      </body>
    </html>
  );
}
