"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * GlobalLoader — shows a thin progress bar at the top of the page
 * during route transitions. Does NOT block the auth check.
 */
export default function GlobalLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [visible, setVisible] = useState(false);
    const [width, setWidth] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        // Start progress bar on route change
        setVisible(true);
        setWidth(20);

        // Simulate progress
        timerRef.current = setTimeout(() => setWidth(60), 150);
        const t2 = setTimeout(() => setWidth(85), 400);
        const t3 = setTimeout(() => {
            setWidth(100);
            setTimeout(() => setVisible(false), 300);
        }, 700);

        return () => {
            clearTimeout(timerRef.current);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [pathname, searchParams]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                height: 3,
                width: `${width}%`,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                transition: "width 0.3s ease",
                boxShadow: "0 0 8px rgba(79, 70, 229, 0.6)",
            }}
        />
    );
}
