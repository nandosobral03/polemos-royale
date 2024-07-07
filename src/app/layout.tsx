import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import Nav from "./_components/utils/nav";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  stylesheets: [
    {
      href: "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap",
    },
  ],
  links: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "crossorigin",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <>
              <Nav />
              <div className="flex min-h-[90vh] flex-col gap-4 px-4 py-8">
                {children}
              </div>
              <Toaster />
            </>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
