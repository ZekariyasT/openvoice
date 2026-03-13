"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Settings,
    Eye,
    Volume2,
    Keyboard,
    Languages,
    RotateCcw,
    Check,
    Type,
    AlignCenter,
    Maximize,
    Contrast,
    MousePointer2,
    MessageSquare,
    Globe,
    Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Default settings
const DEFAULT_SETTINGS = {
    // Visual
    fontSize: 16,
    fontFamily: "Inter",
    letterSpacing: 0,
    lineHeight: 1.5,
    isBold: false,
    isHighContrast: false,
    colorBlindMode: "none", // none, deuteranopia, protanopia, tritanopia

    // Audio
    ttsSpeed: 1,
    ttsPitch: 1,
    autoReadOnLoad: false,
    selectedVoice: "",
    ttsLanguage: "en-US",

    // Navigation
    isKeyboardMode: false,
    focusColor: "#64FFDA",

    // Language
    interfaceLanguage: "en",
};

export default function SettingsPage() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [isSaved, setIsSaved] = useState(false);
    const isFirstRender = useRef(true);

    // Load settings on mount
    useEffect(() => {
        const saved = localStorage.getItem("openvoice_settings");
        if (saved) {
            try {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }

        // Load available voices
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Apply settings to document root and save to localStorage
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            // Also apply initial settings
        }

        const root = document.documentElement;

        // Apply Visual Settings
        root.style.setProperty("--font-size-base", `${settings.fontSize}px`);
        root.style.setProperty("--font-family-main", settings.fontFamily);
        root.style.setProperty("--letter-spacing-base", `${settings.letterSpacing}px`);
        root.style.setProperty("--line-height-base", `${settings.lineHeight}`);
        root.style.setProperty("--font-weight-base", settings.isBold ? "700" : "400");

        // Handle High Contrast
        if (settings.isHighContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast");
        }

        // Handle Color Blind Mode
        const filter = getColorBlindFilter(settings.colorBlindMode);
        root.style.setProperty("--color-blind-filter", filter);

        // Apply Navigation Settings
        root.style.setProperty("--focus-ring-color", settings.focusColor);
        if (settings.isKeyboardMode) {
            root.classList.add("keyboard-mode");
        } else {
            root.classList.remove("keyboard-mode");
        }

        // Save to localStorage
        localStorage.setItem("openvoice_settings", JSON.stringify(settings));

        // Show saved feedback briefly
        setIsSaved(true);
        const timer = setTimeout(() => setIsSaved(false), 2000);
        return () => clearTimeout(timer);
    }, [settings]);

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetToDefaults = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    const getColorBlindFilter = (mode: string) => {
        switch (mode) {
            case "deuteranopia": return "url('#deuteranopia')";
            case "protanopia": return "url('#protanopia')";
            case "tritanopia": return "url('#tritanopia')";
            default: return "none";
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-navy-950 overflow-x-hidden">
            {/* SVG Filters for Color Blind Mode */}
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

            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-widest"
                        >
                            <Monitor className="w-3 h-3" />
                            <span>User Preference Engine</span>
                        </motion.div>
                        <h1 className="text-5xl font-black text-white tracking-tight">
                            Platform <span className="text-accent-blue">Settings</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl text-lg">
                            Fine-tune the interface and engine precisely to your workflow and accessibility requirements.
                        </p>
                    </div>

                    <button
                        onClick={resetToDefaults}
                        className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-2xl transition-all font-bold"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset to Defaults</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Controls */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Visual Section */}
                        <SettingsSection title="Visual & Display" icon={Eye}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <RangeInput
                                        label="Font Size"
                                        icon={Type}
                                        min={12} max={32} step={1}
                                        value={settings.fontSize}
                                        unit="px"
                                        onChange={(val) => updateSetting("fontSize", val)}
                                    />
                                    <RangeInput
                                        label="Letter Spacing"
                                        icon={AlignCenter}
                                        min={-2} max={10} step={0.5}
                                        value={settings.letterSpacing}
                                        unit="px"
                                        onChange={(val) => updateSetting("letterSpacing", val)}
                                    />
                                    <RangeInput
                                        label="Line Height"
                                        icon={Maximize}
                                        min={1} max={3} step={0.1}
                                        value={settings.lineHeight}
                                        unit=""
                                        onChange={(val) => updateSetting("lineHeight", val)}
                                    />
                                </div>
                                <div className="space-y-6">
                                    <ToggleRow
                                        label="Bold Text"
                                        icon={Type}
                                        description="Force extra contrast on typography"
                                        enabled={settings.isBold}
                                        onToggle={() => updateSetting("isBold", !settings.isBold)}
                                    />
                                    <ToggleRow
                                        label="High Contrast"
                                        icon={Contrast}
                                        description="Maximum contrast color palette"
                                        enabled={settings.isHighContrast}
                                        onToggle={() => updateSetting("isHighContrast", !settings.isHighContrast)}
                                    />
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                                            <Contrast className="w-3 h-3 mr-2" /> Color Blind Mode
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {["none", "deuteranopia", "protanopia", "tritanopia"].map(mode => (
                                                <button
                                                    key={mode}
                                                    onClick={() => updateSetting("colorBlindMode", mode)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${settings.colorBlindMode === mode
                                                        ? "bg-accent-blue text-navy-950 border-accent-blue shadow-lg shadow-accent-blue/20"
                                                        : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20"
                                                        }`}
                                                >
                                                    {mode}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SettingsSection>

                        {/* Audio Settings */}
                        <SettingsSection title="Audio & Voice Engine" icon={Volume2}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <RangeInput
                                        label="TTS Speed"
                                        min={0.5} max={2.5} step={0.1}
                                        value={settings.ttsSpeed}
                                        unit="x"
                                        onChange={(val) => updateSetting("ttsSpeed", val)}
                                    />
                                    <RangeInput
                                        label="TTS Pitch"
                                        min={0.5} max={2.0} step={0.1}
                                        value={settings.ttsPitch}
                                        unit=""
                                        onChange={(val) => updateSetting("ttsPitch", val)}
                                    />
                                </div>
                                <div className="space-y-6">
                                    <ToggleRow
                                        label="Auto-read Narrations"
                                        description="Narrate page transitions & alerts"
                                        enabled={settings.autoReadOnLoad}
                                        onToggle={() => updateSetting("autoReadOnLoad", !settings.autoReadOnLoad)}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preferred System Voice</label>
                                        <select
                                            value={settings.selectedVoice}
                                            onChange={(e) => updateSetting("selectedVoice", e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-accent-blue transition-colors"
                                        >
                                            {voices.map(voice => (
                                                <option key={voice.name} value={voice.name} className="bg-navy-900">
                                                    {voice.name} ({voice.lang})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </SettingsSection>
                    </div>

                    {/* Sidebar Controls */}
                    <div className="space-y-8">
                        {/* Navigation Settings */}
                        <SettingsSection title="Interaction" icon={Keyboard}>
                            <div className="space-y-8">
                                <ToggleRow
                                    label="Keyboard-Only Optimization"
                                    description="Prioritize tab-navigation & focus"
                                    enabled={settings.isKeyboardMode}
                                    onToggle={() => updateSetting("isKeyboardMode", !settings.isKeyboardMode)}
                                />
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Focus Ring Color</label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="color"
                                            value={settings.focusColor}
                                            onChange={(e) => updateSetting("focusColor", e.target.value)}
                                            className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer outline-none"
                                        />
                                        <div className="flex-grow glass px-4 py-3 rounded-xl border border-white/5 font-mono text-sm text-gray-300 uppercase">
                                            {settings.focusColor}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-accent-blue/5 border border-accent-blue/10 rounded-2xl">
                                    <p className="text-[10px] font-black text-accent-blue uppercase tracking-widest mb-2 flex items-center">
                                        <Monitor className="w-3 h-3 mr-1" /> Skip-to-content active
                                    </p>
                                    <p className="text-gray-500 text-xs">Press Tab twice on any page to immediately skip navigation.</p>
                                </div>
                            </div>
                        </SettingsSection>

                        {/* Localization Settings */}
                        <SettingsSection title="Localization" icon={Languages}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block flex items-center">
                                        <Globe className="w-3 h-3 mr-2" /> Interface Language
                                    </label>
                                    <select
                                        value={settings.interfaceLanguage}
                                        onChange={(e) => updateSetting("interfaceLanguage", e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-accent-blue transition-colors"
                                    >
                                        <option value="en" className="bg-navy-900">English (Global)</option>
                                        <option value="ar" className="bg-navy-900">Arabic (العربية)</option>
                                        <option value="fr" className="bg-navy-900">French (Français)</option>
                                        <option value="es" className="bg-navy-900">Spanish (Español)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block flex items-center">
                                        <MessageSquare className="w-3 h-3 mr-2" /> Engine Language
                                    </label>
                                    <select
                                        value={settings.ttsLanguage}
                                        onChange={(e) => updateSetting("ttsLanguage", e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-accent-blue transition-colors"
                                    >
                                        <option value="en-US" className="bg-navy-900">English (US)</option>
                                        <option value="en-GB" className="bg-navy-900">English (UK)</option>
                                        <option value="ar-SA" className="bg-navy-900">Arabic (SA)</option>
                                        <option value="fr-FR" className="bg-navy-900">French (FR)</option>
                                        <option value="es-ES" className="bg-navy-900">Spanish (ES)</option>
                                    </select>
                                </div>
                            </div>
                        </SettingsSection>
                    </div>
                </div>
            </div>

            {/* Floating Save Feedback */}
            <AnimatePresence>
                {isSaved && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-accent-blue rounded-full text-navy-950 font-black shadow-2xl flex items-center space-x-3 pointer-events-none"
                    >
                        <Check className="w-5 h-5" />
                        <span>Preferences Automated & Saved</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SettingsSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col space-y-8 bg-white/[0.01]"
        >
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent-blue/10 rounded-xl">
                    <Icon className="text-accent-blue w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
            </div>
            <div className="space-y-8">
                {children}
            </div>
        </motion.div>
    );
}

function RangeInput({ label, icon: Icon, min, max, step, value, onChange, unit }: {
    label: string;
    icon?: React.ElementType;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (val: number) => void;
    unit: string;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                    {Icon && <Icon className="w-3 h-3 mr-2" />} {label}
                </label>
                <span className="text-accent-blue font-bold px-3 py-1 bg-accent-blue/10 rounded-lg border border-accent-blue/20 text-xs">
                    {value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full accent-accent-blue bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer hover:bg-white/20 transition-all"
            />
        </div>
    );
}

function ToggleRow({ label, icon: Icon, description, enabled, onToggle }: {
    label: string;
    icon?: React.ElementType;
    description?: string;
    enabled: boolean;
    onToggle?: () => void;
}) {
    return (
        <div className="flex items-center justify-between group">
            <div className="space-y-1">
                <p className="text-white font-bold tracking-tight flex items-center">
                    {Icon && <Icon className="w-3 h-3 mr-2 text-gray-500 group-hover:text-accent-blue transition-colors" />} {label}
                </p>
                <p className="text-xs text-gray-500 italic">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`w-14 h-8 rounded-full transition-all relative border ${enabled
                    ? "bg-accent-blue border-accent-blue shadow-lg shadow-accent-blue/20"
                    : "bg-white/5 border-white/10"
                    }`}
            >
                <motion.div
                    animate={{ x: enabled ? 24 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-1 w-5 h-5 rounded-full ${enabled ? "bg-navy-950" : "bg-gray-500"}`}
                />
            </button>
        </div>
    );
}
