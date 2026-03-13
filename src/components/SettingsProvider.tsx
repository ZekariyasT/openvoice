"use client";

import React, { useEffect } from "react";

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const applySettings = () => {
            const saved = localStorage.getItem("openvoice_settings");
            if (!saved) return;

            try {
                const settings = JSON.parse(saved);
                const root = document.documentElement;

                // Apply Visual Settings
                root.style.setProperty("--font-size-base", `${settings.fontSize}px`);
                root.style.setProperty("--font-family-main", settings.fontFamily || "Inter");
                root.style.setProperty("--letter-spacing-base", `${settings.letterSpacing || 0}px`);
                root.style.setProperty("--line-height-base", `${settings.lineHeight || 1.5}`);
                root.style.setProperty("--font-weight-base", settings.isBold ? "700" : "400");

                // High Contrast
                if (settings.isHighContrast) root.classList.add("high-contrast");
                else root.classList.remove("high-contrast");

                // Color Blind Mode
                const getColorBlindFilter = (mode: string) => {
                    switch (mode) {
                        case "deuteranopia": return "url('#deuteranopia')";
                        case "protanopia": return "url('#protanopia')";
                        case "tritanopia": return "url('#tritanopia')";
                        default: return "none";
                    }
                };
                root.style.setProperty("--color-blind-filter", getColorBlindFilter(settings.colorBlindMode));

                // Navigation Settings
                root.style.setProperty("--focus-ring-color", settings.focusColor || "#64FFDA");
                if (settings.isKeyboardMode) root.classList.add("keyboard-mode");
                else root.classList.remove("keyboard-mode");

            } catch (e) {
                console.error("Error applying global settings", e);
            }
        };

        applySettings();

        // Listen for changes in other tabs/windows
        window.addEventListener("storage", (e) => {
            if (e.key === "openvoice_settings") applySettings();
        });

        return () => window.removeEventListener("storage", applySettings);
    }, []);

    return (
        <>
            {/* SVG Filters for Color Blind Mode - Global */}
            <svg className="hidden">
                <filter id="deuteranopia">
                    <feColorMatrix values="0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0" />
                </filter>
                <filter id="protanopia">
                    <feColorMatrix values="0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0" />
                </filter>
                <filter id="tritanopia">
                    <feColorMatrix values="0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0" />
                </filter>
            </svg>
            {children}
        </>
    );
}
