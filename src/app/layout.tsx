// frontend/src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
