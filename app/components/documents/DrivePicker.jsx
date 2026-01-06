"use client";

import { useEffect, useMemo, useState } from "react";
import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY } from "../../lib/constants";

export default function DrivePicker({ onPicked }) {
    const [pickerReady, setPickerReady] = useState(false);
    const [error, setError] = useState(null);

    const enabled = useMemo(
        () => Boolean(GOOGLE_CLIENT_ID && GOOGLE_API_KEY),
        []
    );

    // Load Google scripts
    useEffect(() => {
        if (!enabled) return;

        const loadScript = (src) =>
            new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () =>
                    reject(new Error(`Failed to load ${src}`));
                document.body.appendChild(script);
            });

        (async () => {
            try {
                await loadScript("https://accounts.google.com/gsi/client");
                await loadScript("https://apis.google.com/js/api.js");

                window.gapi.load("picker", () => {
                    setPickerReady(true);
                });
            } catch (e) {
                setError(e.message || "Failed to load Google Picker");
            }
        })();
    }, [enabled]);

    function openPicker() {
        setError(null);

        if (!enabled) {
            setError(
                "Google Drive is not configured. Check Client ID and API Key."
            );
            return;
        }

        if (!pickerReady) {
            setError("Google Picker is still loading. Please wait.");
            return;
        }

        const tokenClient =
            window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: "https://www.googleapis.com/auth/drive.readonly",
                callback: (resp) => {
                    if (!resp?.access_token) {
                        setError("Failed to obtain access token.");
                        return;
                    }

                    const accessToken = resp.access_token;

                    const docsView = new window.google.picker.DocsView(
                        window.google.picker.ViewId.DOCS
                    )
                        .setIncludeFolders(false)
                        .setSelectFolderEnabled(false);

                    const picker = new window.google.picker.PickerBuilder()
                        .setDeveloperKey(GOOGLE_API_KEY)
                        .setOAuthToken(accessToken)
                        .addView(docsView)
                        .setCallback((data) => {
                            if (
                                data.action ===
                                window.google.picker.Action.PICKED
                            ) {
                                const doc = data.docs?.[0];
                                if (doc?.id && doc?.name) {
                                    onPicked(
                                        { id: doc.id, name: doc.name },
                                        accessToken
                                    );
                                }
                            }
                        })
                        .build();

                    picker.setVisible(true);
                },
            });

        tokenClient.requestAccessToken({ prompt: "" });
    }

    return (
        <div>
            <button
                className="btn btn-outline-primary"
                onClick={openPicker}
                disabled={!enabled}
            >
                📂 Pick from Google Drive
            </button>

            {!enabled && (
                <div className="text-muted small mt-2">
                    Configure Google Client ID and API Key to enable Drive
                    picker.
                </div>
            )}

            {error && (
                <div className="text-danger small mt-2">
                    Error: {error}
                </div>
            )}
        </div>
    );
}
