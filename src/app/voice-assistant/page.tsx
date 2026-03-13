"use client";

import React, { useState } from "react";
import { Volume2, Mic, Settings, Play, Pause, RotateCcw } from "lucide-react";

export default function VoiceAssistantPage() {
    const [isListening, setIsListening] = useState(false);

    return (
        <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
            <div className="space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-white flex items-center justify-center space-x-3">
                        <Volume2 className="text-accent-blue w-10 h-10" />
                        <span>Voice Assistant</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Speak naturally. Our AI assistant can understand multiple accents and languages.
                    </p>
                </div>

                {/* Visualizer Area */}
                <div className="relative glass aspect-[21/9] rounded-[40px] border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent pointer-events-none" />

                    {/* Animated Visualizer Mockup */}
                    <div className="flex items-end space-x-2 h-32">
                        {[...Array(24)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 bg-accent-blue rounded-full transition-all duration-300 ${isListening ? "animate-pulse" : "h-4 opacity-30"
                                    }`}
                                style={{
                                    height: isListening ? `${Math.random() * 80 + 20}%` : "16px",
                                    animationDelay: `${i * 0.1}s`
                                }}
                            />
                        ))}
                    </div>

                    <div className="mt-12 flex flex-col items-center space-y-6">
                        <button
                            onClick={() => setIsListening(!isListening)}
                            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(56,189,248,0.2)] ${isListening ? "bg-red-500 shadow-red-500/20" : "bg-accent-blue"
                                }`}
                            aria-label={isListening ? "Stop Listening" : "Start Listening"}
                        >
                            <Mic className={`w-10 h-10 ${isListening ? "text-white" : "text-navy-950"}`} />
                        </button>
                        <p className="text-white font-semibold text-xl tracking-wide">
                            {isListening ? "Listening..." : "Tap to Speak"}
                        </p>
                    </div>
                </div>

                {/* Interaction History */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Transcript</h2>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            <SpeechBubble type="user" text="What's the weather like today?" />
                            <SpeechBubble type="assistant" text="It's currently 72°F and sunny in San Francisco. Perfect for a walk!" />
                            <SpeechBubble type="user" text="Read my last few emails." />
                            <SpeechBubble type="assistant" text="You have 3 unread emails. One from Sarah about the project, one from LinkedIn, and a newsletter..." />
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-6">Voice Controls</h2>
                        <div className="space-y-6">
                            <ControlItem label="Assistant Speed" value="1.2x" />
                            <ControlItem label="Voice Model" value="Serena (Eco)" />
                            <ControlItem label="Input Sensitivity" value="High" />
                        </div>

                        <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2">
                            <Settings className="w-5 h-5" />
                            <span>Voice Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpeechBubble({ type, text }: { type: "user" | "assistant"; text: string }) {
    return (
        <div className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${type === "user"
                    ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                    : "bg-navy-900 text-gray-300 border border-white/5"
                }`}>
                {text}
            </div>
        </div>
    );
}

function ControlItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="text-white font-medium bg-white/5 px-3 py-1 rounded-lg border border-white/10">{value}</span>
        </div>
    );
}
