"use client";

import React from "react";
import { Languages, Camera, Info, History } from "lucide-react";

export default function SignLanguagePage() {
    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="flex-grow space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white flex items-center space-x-3">
                            <Languages className="text-accent-blue w-10 h-10" />
                            <span>Sign Language Translator</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Real-time ASL translation using advanced computer vision.
                            Position your hands within the camera frame to begin.
                        </p>
                    </div>

                    {/* Camera Viewport */}
                    <div className="relative aspect-video glass rounded-3xl overflow-hidden border border-white/10 group">
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-accent-blue/10 flex items-center justify-center border border-accent-blue/20">
                                <Camera className="text-accent-blue w-10 h-10" />
                            </div>
                            <p className="text-white font-medium">Allow Camera Access to start translating</p>
                            <button className="px-6 py-2 bg-accent-blue text-navy-950 font-bold rounded-lg hover:bg-accent-bright transition-all">
                                Start Camera
                            </button>
                        </div>

                        {/* Camera Overlay UI (UI Mockup) */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="glass px-4 py-2 rounded-lg text-sm text-accent-blue border border-accent-blue/20">
                                Resolution: 1080p • Latency: 45ms
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-3 glass rounded-xl border border-white/10 text-white hover:bg-white/10">
                                    <Info className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Result Area */}
                    <div className="glass p-8 rounded-3xl border border-accent-blue/20 min-h-[150px] relative">
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <button className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded text-xs font-bold uppercase tracking-wider border border-accent-blue/20">
                                Copy Text
                            </button>
                        </div>
                        <h3 className="text-navy-400 font-bold uppercase tracking-widest text-xs mb-4">Translation Output</h3>
                        <p className="text-2xl text-white font-medium leading-relaxed">
                            Waiting for input...
                        </p>
                    </div>
                </div>

                {/* Sidebar Info/History */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="glass p-6 rounded-2xl border border-white/5">
                        <h2 className="text-white font-bold mb-4 flex items-center">
                            <History className="w-5 h-5 mr-2 text-accent-blue" />
                            Recent History
                        </h2>
                        <div className="space-y-4">
                            <HistoryItem text="How are you today?" time="2 mins ago" />
                            <HistoryItem text="Thank you for your help" time="15 mins ago" />
                            <HistoryItem text="Where is the library?" time="1 hour ago" />
                        </div>
                    </div>

                    <div className="glass p-6 rounded-2xl border border-white/5 bg-accent-blue/5">
                        <h2 className="text-white font-bold mb-2">Pro Tip</h2>
                        <p className="text-sm text-gray-400">
                            Ensure you have good lighting and a clear background for better accuracy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HistoryItem({ text, time }: { text: string; time: string }) {
    return (
        <div className="space-y-1">
            <p className="text-white text-sm line-clamp-1">{text}</p>
            <p className="text-gray-500 text-xs">{time}</p>
        </div>
    );
}
