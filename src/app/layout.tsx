// frontend/src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="WF2XUxGii2MkY2Ltao10yC2dsAichcRx64AU3siGsQc" />
      </head>
      <body className="h-full">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
