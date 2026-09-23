import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apex Fitness | Hussain's Transformation Hub",
  description: "Personal 12-Week Gym Workout, Progressive Overload & Health Tracking Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#08080a] text-[#ffffff] min-h-screen flex antialiased selection:bg-[#ee4d00] selection:text-white`}>
        {/* Left Desktop Navigation */}
        <Sidebar />

        {/* Main Application Container */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 lg:pb-8">
          <Header />
          <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  );
}
