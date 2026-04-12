import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import QueryProvider from "@/providers/QueryProvider";
import NextTopLoader from "nextjs-toploader";
import { EnvironmentHelper } from "@/lib/environment-utils";

const pt_sans = PT_Sans({
  subsets: ["latin"],
  display: "block",
  weight: "400",
});

export const metadata: Metadata = {
  title: EnvironmentHelper.getMetaTitle(),
  description: EnvironmentHelper.getMetaDescription("IFRS9 Model Execution"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const env = EnvironmentHelper.getCurrent();

  return (
    <html lang="en" className={`environment-${env}`} data-environment={env}>
      <body className={`${pt_sans.className} antialiased text-bl-base`}>
        <NextTopLoader color="#AFEB2B" showSpinner={false} />
        <Suspense fallback={<div></div>}>
          <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors position="top-right" closeButton />
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
