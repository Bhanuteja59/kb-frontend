"use client";
import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";

export default function ChatbotEmbed() {
    const { user } = useAuthContext();

    useEffect(() => {
        // Only run if user exists and has an org
        if (user && (user.org_slug || user.org_id)) {
            const orgIdentifier = user.org_slug || user.org_id;

            // Check if already injected
            if (document.getElementById("injected-kb-widget")) return;

            // Inject Script
            const script = document.createElement("script");
            script.src = "/widget.js"; // Served from public/
            script.id = "injected-kb-widget";
            script.setAttribute("data-org-id", orgIdentifier);
            script.async = true;
            document.body.appendChild(script);

            // Cleanup function to remove widget when user logs out or component unmounts
            return () => {
                const widgetRoot = document.getElementById("kb-rag-widget-root");
                if (widgetRoot) {
                    widgetRoot.remove();
                }
                const injectedScript = document.getElementById("injected-kb-widget");
                if (injectedScript) {
                    injectedScript.remove();
                }
            };
        }
    }, [user]);

    return null; // Render nothing visually, just handle side effects
}
