"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "../../loading/page";

export default function GlobalLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Trigger loading on mount and on route change
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2.0 seconds minimum duration

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    if (!isLoading) return null;

    return <LoadingPage />;
}
