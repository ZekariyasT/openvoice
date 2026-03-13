"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, Search, ChevronRight, PlayCircle } from "lucide-react";

export default function ImageDescriberPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Upload & Preview */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white flex items-center space-x-3">
                            <ImageIcon className="text-accent-blue w-10 h-10" />
                            <span>Image Describer</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Upload any image to receive a high-fidelity audio and text description.
                        </p>
                    </div>

                    <div className="aspect-square md:aspect-[4/3] glass rounded-[40px] border-2 border-dashed border-white/10 hover:border-accent-blue/40 transition-all group flex flex-col items-center justify-center p-12 cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-accent-blue/0 group-hover:bg-accent-blue/5 transition-colors" />

                        <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
                            <div className="w-24 h-24 bg-navy-900 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                <Upload className="text-accent-blue w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-white font-bold text-2xl">Drop your image here</p>
                                <p className="text-gray-400">or click to browse your files</p>
                            </div>
                            <div className="flex space-x-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
                                <span>JPG</span>
                                <span>PNG</span>
                                <span>WebP</span>
                                <span>Max 10MB</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Results & Analysis */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-8 h-full">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <Search className="w-5 h-5 mr-2 text-accent-blue" />
                                Scene Analysis
                            </h2>

                            <div className="space-y-4">
                                <p className="text-gray-400 leading-relaxed italic">
                                    Image description will appear here after analysis...
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Visual Elements</h3>
                            <div className="flex flex-wrap gap-2">
                                <Tag label="Objects" />
                                <Tag label="Colors" />
                                <Tag label="Context" />
                                <Tag label="Text (OCR)" />
                                <Tag label="Faces" />
                            </div>
                        </div>

                        <div className="pt-8 space-y-4">
                            <button className="w-full py-4 bg-accent-blue text-navy-950 font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-accent-bright transition-all">
                                <PlayCircle className="w-5 h-5" />
                                <span>Play Audio Description</span>
                            </button>
                            <button className="w-full py-4 glass border border-white/10 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 hover:bg-white/10 transition-all">
                                <span>Download Transcript</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Tag({ label }: { label: string }) {
    return (
        <span className="px-4 py-2 bg-navy-900 border border-white/10 text-gray-400 rounded-full text-xs font-medium">
            {label}
        </span>
    );
}
