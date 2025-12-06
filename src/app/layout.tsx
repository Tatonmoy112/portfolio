import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tatonmoy112.github.io/portfolio/"),
  title: "TAT",
  description: "Portfolio of Tanvir Ahmed Tonmoy",
  icons: {
    icon: "/Tanvir.jpg",
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalFloatingDock } from "@/components/layout/conditional-floating-dock";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen relative w-full overflow-hidden bg-black">
            {children}
            <ConditionalFloatingDock />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
