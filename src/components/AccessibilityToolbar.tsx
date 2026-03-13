"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Settings,
    X,
    Type,
    Bold,
    Contrast,
    Glasses,
    MoveHorizontal,
    RotateCcw,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "openvoice-accessibility-settings";

interface AccessibilitySettings {
    fontSize: number;
    isBold: boolean;
    highContrast: boolean;
    dyslexicFont: boolean;
    textSpacing: number;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
    fontSize: 16,
    isBold: false,
    highContrast: false,
    dyslexicFont: false,
    textSpacing: 0,
};

export default function AccessibilityToolbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
    const [isMounted, setIsMounted] = useState(false);

    // Load settings on mount
    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings(parsed);
            } catch (e) {
                console.error("Failed to parse accessibility settings", e);
            }
        }
    }, []);

    // Apply settings to DOM
    useEffect(() => {
        if (!isMounted) return;

        const root = document.documentElement;

        // Apply CSS Variables
        root.style.setProperty("--font-size", `${settings.fontSize}px`);
        root.style.setProperty("--font-weight", settings.isBold ? "700" : "400");
        root.style.setProperty("--letter-spacing", `${settings.textSpacing}px`);

        // Apply Data Attributes for logic in globals.css
        root.setAttribute("data-dyslexic", settings.dyslexicFont.toString());
        root.setAttribute("data-high-contrast", settings.highContrast.toString());

        // Persist to LocalStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings, isMounted]);

    const updateSetting = <K extends keyof AccessibilitySettings>(
        key: K,
        value: AccessibilitySettings[K]
    ) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    if (!isMounted) return null;

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex items-center">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="p-3 bg-accent-blue text-navy-950 rounded-l-2xl shadow-2xl border border-white/10 hover:bg-accent-bright transition-colors group"
                        aria-label="Open Accessibility Toolbar"
                        aria-expanded="false"
                    >
                        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="w-80 glass rounded-3xl border border-white/10 shadow-2xl p-6 relative overflow-hidden"
                        role="dialog"
                        aria-label="Accessibility Toolbar"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-2">
                                <Settings className="text-accent-blue w-5 h-5" />
                                <h2 className="text-white font-bold tracking-tight">Accessibility</h2>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={resetSettings}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                    aria-label="Reset all settings"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                    aria-label="Close toolbar"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Font Size */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-300 flex items-center">
                                        <Type className="w-4 h-4 mr-2" /> Font Size
                                    </span>
                                    <span className="text-accent-blue font-bold text-xs">{settings.fontSize}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="12"
                                    max="28"
                                    value={settings.fontSize}
                                    onChange={(e) => updateSetting("fontSize", parseInt(e.target.value))}
                                    className="w-full accent-accent-blue h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    aria-label="Adjust font size"
                                />
                            </div>

                            {/* Text Spacing */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-300 flex items-center">
                                        <MoveHorizontal className="w-4 h-4 mr-2" /> Text Spacing
                                    </span>
                                    <span className="text-accent-blue font-bold text-xs">+{settings.textSpacing}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={settings.textSpacing}
                                    onChange={(e) => updateSetting("textSpacing", parseFloat(e.target.value))}
                                    className="w-full accent-accent-blue h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    aria-label="Adjust text spacing"
                                />
                            </div>

                            {/* Toggles */}
                            <div className="grid grid-cols-1 gap-3">
                                <ToolbarToggle
                                    icon={Bold}
                                    label="Bold Text"
                                    active={settings.isBold}
                                    onClick={() => updateSetting("isBold", !settings.isBold)}
                                />
                                <ToolbarToggle
                                    icon={Contrast}
                                    label="High Contrast"
                                    active={settings.highContrast}
                                    onClick={() => updateSetting("highContrast", !settings.highContrast)}
                                />
                                <ToolbarToggle
                                    icon={Glasses}
                                    label="Dyslexia Font"
                                    active={settings.dyslexicFont}
                                    onClick={() => updateSetting("dyslexicFont", !settings.dyslexicFont)}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center">
                                Settings persist automatically
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ToolbarToggle({ icon: Icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${active
                    ? "bg-accent-blue/10 border-accent-blue/50 text-white"
                    : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
            aria-pressed={active}
        >
            <div className="flex items-center">
                <Icon className={`w-4 h-4 mr-3 ${active ? "text-accent-blue" : "text-gray-500"}`} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? "bg-accent-blue" : "bg-white/20"}`}>
                <motion.div
                    animate={{ x: active ? 16 : 0 }}
                    className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                />
            </div>
        </button>
    );
}
