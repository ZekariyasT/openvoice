"use client";

import React, { useState } from "react";
import { Accessibility, Check, Eye, Type, MousePointer2 } from "lucide-react";

export default function AccessibilityToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeOptions, setActiveOptions] = useState<string[]>([]);

    const toggleOption = (id: string) => {
        setActiveOptions(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const options = [
        { id: "contrast", name: "High Contrast", icon: Eye },
        { id: "large-text", name: "Large Text", icon: Type },
        { id: "reduce-motion", name: "Reduce Motion", icon: MousePointer2 },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full border transition-all ${isOpen || activeOptions.length > 0
                        ? "bg-accent-blue border-accent-blue text-navy-950"
                        : "bg-navy-900 border-white/10 text-accent-blue hover:bg-navy-800"
                    }`}
                aria-label="Accessibility Settings"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Accessibility className="w-5 h-5" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-64 glass rounded-2xl border border-white/10 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <h3 className="text-white font-bold mb-4 text-sm px-2">Quick Accessibility</h3>
                        <div className="space-y-1">
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => toggleOption(option.id)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                >
                                    <div className="flex items-center space-x-3">
                                        <option.icon className={`w-4 h-4 ${activeOptions.includes(option.id) ? "text-accent-blue" : "text-gray-400 group-hover:text-white"}`} />
                                        <span className={`text-sm ${activeOptions.includes(option.id) ? "text-white font-medium" : "text-gray-400 group-hover:text-white"}`}>
                                            {option.name}
                                        </span>
                                    </div>
                                    {activeOptions.includes(option.id) && (
                                        <Check className="w-4 h-4 text-accent-blue" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 px-2">
                            <a
                                href="/settings"
                                className="text-xs text-accent-blue hover:text-accent-bright font-semibold uppercase tracking-wider"
                                onClick={() => setIsOpen(false)}
                            >
                                All Settings
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
