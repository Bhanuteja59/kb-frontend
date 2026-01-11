"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "../../loading/page";

import { useAuthContext } from "../../context/AuthContext";

export default function GlobalLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const { loading: authLoading } = useAuthContext();

    useEffect(() => {
        // Trigger loading on mount and on route change
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // reduced to 1.0 second for snappiness

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    // Show loader if EITHER local route timer is running OR Auth is initialising
    if (isLoading || authLoading) return <LoadingPage />;

    return null;
}
