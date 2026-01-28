import "./styles/globals.css";
import "./loading/loading.css";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME || "KB Admin Portal",
    description: "Admin portal for managing documents and RAG knowledge base."
};

import { AuthProvider } from "./context/AuthContext";
import WakeUpBackend from "./components/layout/WakeUpBackend";

import { Suspense } from "react";
import GlobalLoader from "./components/layout/GlobalLoader";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous" />
            </head>
            <body>
                <AuthProvider>
                    <Suspense fallback={null}>
                        <GlobalLoader />
                    </Suspense>
                    <WakeUpBackend />
                    {children}
                </AuthProvider>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossOrigin="anonymous" defer></script>
            </body>
        </html>
    );
}
