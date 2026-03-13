"use client";

import React, { useState } from "react";
import { Settings, Eye, Volume2, Keyboard, Monitor, Save, Bell } from "lucide-react";

export default function SettingsPage() {
    const [fontSize, setFontSize] = useState("normal");
    const [highContrast, setHighContrast] = useState(false);

    return (
        <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
            <div className="space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-white flex items-center space-x-3">
                        <Settings className="text-accent-blue w-10 h-10" />
                        <span>Accessibility Settings</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Customize your OpenVoice experience to best suit your needs.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Visual Settings */}
                    <Section title="Visual & Display" icon={Eye}>
                        <div className="space-y-6">
                            <ToggleRow
                                label="High Contrast Mode"
                                description="Increases color contrast for better readability."
                                enabled={highContrast}
                                onToggle={() => setHighContrast(!highContrast)}
                            />
                            <SelectRow
                                label="Text Size"
                                value={fontSize}
                                options={["Small", "Normal", "Large", "Extra Large"]}
                                onChange={setFontSize}
                            />
                            <ToggleRow
                                label="Reduce Motion"
                                description="Minimizes animations and transitions."
                                enabled={false}
                            />
                        </div>
                    </Section>

                    {/* Audio Settings */}
                    <Section title="Audio & Voice" icon={Volume2}>
                        <div className="space-y-6">
                            <ToggleRow
                                label="Screen Reader Support"
                                description="Optimizes UI elements for external screen readers."
                                enabled={true}
                            />
                            <ToggleRow
                                label="Auto-play Audio Descriptions"
                                description="Automatically plays image descriptions when ready."
                                enabled={false}
                            />
                        </div>
                    </Section>

                    {/* Interaction Settings */}
                    <Section title="Interaction" icon={Keyboard}>
                        <div className="space-y-6">
                            <ToggleRow
                                label="Keyboard Shortcuts"
                                description="Enable global hotkeys for platform features."
                                enabled={true}
                            />
                            <ToggleRow
                                label="Sticky Keys"
                                description="For users with motor impairments."
                                enabled={false}
                            />
                        </div>
                    </Section>
                </div>

                {/* Save Bar */}
                <div className="sticky bottom-8 left-0 right-0 p-4 glass rounded-2xl border border-accent-blue/20 flex items-center justify-between">
                    <p className="text-gray-400 text-sm hidden md:block">
                        Changes are saved automatically to your profile.
                    </p>
                    <button className="flex-grow md:flex-grow-0 px-8 py-3 bg-accent-blue text-navy-950 font-bold rounded-xl hover:bg-accent-bright transition-all flex items-center justify-center space-x-2">
                        <Save className="w-5 h-5" />
                        <span>Apply All Changes</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
    return (
        <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-3">
                <Icon className="text-accent-blue w-6 h-6" />
                <span>{title}</span>
            </h2>
            <div className="pt-4 border-t border-white/5">
                {children}
            </div>
        </div>
    );
}

function ToggleRow({ label, description, enabled, onToggle }: any) {
    return (
        <div className="flex items-center justify-between gap-8">
            <div className="space-y-1">
                <p className="text-white font-medium">{label}</p>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`w-14 h-8 rounded-full transition-colors relative ${enabled ? "bg-accent-blue" : "bg-white/10"}`}
            >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${enabled ? "translate-x-6" : ""}`} />
            </button>
        </div>
    );
}

function SelectRow({ label, value, options, onChange }: any) {
    return (
        <div className="flex items-center justify-between">
            <p className="text-white font-medium">{label}</p>
            <div className="flex bg-navy-900 rounded-lg p-1 border border-white/10">
                {options.map((opt: string) => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt.toLowerCase())}
                        className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${value === opt.toLowerCase() ? "bg-accent-blue text-navy-950 shadow-lg" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
