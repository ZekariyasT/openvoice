"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Image as ImageIcon,
    Upload,
    Sparkles,
    Volume2,
    VolumeX,
    Loader2,
    X,
    RefreshCw,
    Camera,
    Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageDescriberPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        synthRef.current = window.speechSynthesis;
        return () => {
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        setError("");
        setDescription("");
        if (synthRef.current) synthRef.current.cancel();

        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const describeImage = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        setError("");
        setDescription("");

        try {
            const response = await fetch("/api/describe-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: selectedImage }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to describe image");
            }

            setDescription(data.description);
            speak(data.description);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const speak = (text: string) => {
        if (!synthRef.current || !text) return;

        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const reset = () => {
        setSelectedImage(null);
        setDescription("");
        setError("");
        stopSpeaking();
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-navy-950">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-widest"
                    >
                        <Camera className="w-3 h-3" />
                        <span>Multimodal Vision</span>
                    </motion.div>
                    <h1 className="text-5xl font-black text-white tracking-tight">
                        Image <span className="text-accent-blue">Describer</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Neural sight for the visually impaired. Upload any image and receive high-fidelity, descriptive audio feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Upload Zone */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`glass relative group rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden min-h-[400px] flex flex-col ${selectedImage
                                ? "border-accent-blue/50 bg-accent-blue/[0.02]"
                                : "border-white/10 hover:border-accent-blue/40 bg-white/[0.02] hover:bg-white/[0.04]"
                            }`}
                        onClick={() => !selectedImage && fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const file = e.dataTransfer.files?.[0];
                            if (file) processFile(file);
                        }}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />

                        {!selectedImage ? (
                            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-6">
                                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent-blue/10 group-hover:border-accent-blue/20 transition-all duration-500">
                                    <Upload className="w-10 h-10 text-gray-500 group-hover:text-accent-blue" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xl font-bold text-white tracking-tight">Select an Image</p>
                                    <p className="text-gray-500 max-w-[200px] mx-auto text-sm">
                                        Drag and drop or click to browse your library
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col relative bg-navy-900/50">
                                <img
                                    src={selectedImage}
                                    alt="Reviewing upload"
                                    className="w-full h-full object-cover opacity-60 mix-blend-screen"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <div className="glass p-1 rounded-2xl border border-white/20 shadow-2xl">
                                        <img src={selectedImage} alt="Preview" className="max-h-[300px] rounded-xl object-contain" />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); reset(); }}
                                    className="absolute top-6 right-6 p-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all border border-red-500/20 backdrop-blur-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Analysis View */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col space-y-6"
                    >
                        <div className="glass rounded-[2.5rem] border border-white/5 p-10 flex-grow flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Sparkles className="w-32 h-32 text-accent-blue" />
                            </div>

                            <div className="relative flex-grow flex flex-col space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-accent-blue/10 rounded-lg">
                                            <Sparkles className="text-accent-blue w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-black text-white tracking-tight italic">AI Narrative</h2>
                                    </div>
                                    {description && (
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => speak(description)}
                                                className={`p-3 rounded-xl transition-all ${isSpeaking ? "bg-accent-blue text-navy-950" : "bg-white/5 text-gray-400 hover:text-white"}`}
                                            >
                                                <Volume2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={stopSpeaking}
                                                className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all"
                                            >
                                                <VolumeX className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow flex flex-col justify-center">
                                    {!selectedImage ? (
                                        <div className="text-center py-20 space-y-4">
                                            <ImageIcon className="w-16 h-16 text-white/5 mx-auto" />
                                            <p className="text-gray-600 font-medium">Upload an image to generate description</p>
                                        </div>
                                    ) : isAnalyzing ? (
                                        <div className="flex flex-col items-center justify-center space-y-6 py-20">
                                            <div className="relative">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="w-16 h-16 border-t-2 border-r-2 border-accent-blue rounded-full"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-accent-blue/20 rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                            <p className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs animate-pulse">Analyzing Scene...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center space-y-4">
                                            <p className="font-medium">{error}</p>
                                            <button
                                                onClick={describeImage}
                                                className="flex items-center space-x-2 mx-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                <span>Retry</span>
                                            </button>
                                        </div>
                                    ) : description ? (
                                        <div className="space-y-4">
                                            <p className="text-gray-300 text-lg leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-accent-blue first-letter:mr-3 first-letter:float-left">
                                                {description}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-8 py-4 border-t border-white/5">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Claude 3.5 Sonnet Processing Complete</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <button
                                                onClick={describeImage}
                                                className="px-12 py-5 bg-accent-blue hover:bg-accent-bright text-navy-950 font-black rounded-3xl transition-all shadow-[0_0_80px_rgba(56,189,248,0.3)] hover:scale-105 active:scale-95 flex items-center space-x-3 mx-auto"
                                            >
                                                <Play className="w-5 h-5 fill-current" />
                                                <span>Analyze Visuals</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
