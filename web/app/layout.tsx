import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/main/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "UPI Fraud Detection",
  description: "Check UPI transactions for fraud with a Random Forest model",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} antialiased`}>
        <div className="flex min-h-screen flex-col md:flex-row">
          <AppSidebar />
          <main className="flex-1 overflow-x-hidden p-4 md:p-8">
            {children}
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
