import "./styles/globals.css";

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME || "KB Admin Portal",
    description: "Admin portal for managing documents and RAG knowledge base."
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous" />
            </head>
            <body>{children}</body>
        </html>
    );
}
