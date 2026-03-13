"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Camera,
    CameraOff,
    Volume2,
    History,
    Circle,
    Sparkles,
    Trash2,
    RefreshCw,
    Play,
    Square
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignLanguageTranslator() {
    const [isActive, setIsActive] = useState(false);
    const [prediction, setPrediction] = useState("");
    const [confidence, setConfidence] = useState("");
    const [transcript, setTranscript] = useState<string[]>([]);
    const [error, setError] = useState("");

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        synthRef.current = window.speechSynthesis;
        return () => {
            stopTranslator();
        };
    }, []);

    const startTranslator = async () => {
        setError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: "user" }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsActive(true);
                startPolling();
            }
        } catch (err: any) {
            console.error("Camera access error:", err);
            setError("Unable to access camera. Please ensure permissions are granted.");
        }
    };

    const stopTranslator = () => {
        setIsActive(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    const captureFrame = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || !isActive) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64Image = canvas.toDataURL("image/jpeg", 0.8);

            try {
                const response = await fetch("/api/predict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64Image }),
                });

                const data = await response.json();
                if (data.prediction) {
                    setPrediction(data.prediction);
                    setConfidence(data.confidence);

                    // Add to transcript if it's different from the last one
                    setTranscript(prev => {
                        if (prev.length === 0 || prev[prev.length - 1] !== data.prediction) {
                            return [...prev, data.prediction];
                        }
                        return prev;
                    });
                }
            } catch (err) {
                console.error("Prediction error:", err);
            }
        }
    }, [isActive]);

    const startPolling = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(captureFrame, 200);
    };

    const speakPrediction = () => {
        if (!synthRef.current || !prediction) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(prediction);
        synthRef.current.speak(utterance);
    };

    const clearTranscript = () => {
        setTranscript([]);
        setPrediction("");
        setConfidence("");
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-navy-950">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Computer Vision Engine</span>
                    </motion.div>
                    <h1 className="text-5xl font-black text-white tracking-tight">
                        Sign Language <span className="text-green-400">Translator</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Real-time gestural analysis for seamless communication. Our neural network
                        processes frames at 5Hz for low-latency translation.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative glass rounded-[2.5rem] border border-white/10 overflow-hidden aspect-video bg-navy-900 flex items-center justify-center">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover ${isActive ? "opacity-100" : "opacity-20"}`}
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {!isActive && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-8 text-center">
                                    <CameraOff className="w-16 h-16 text-gray-600 mb-2" />
                                    <h3 className="text-xl font-bold text-white">Camera is Off</h3>
                                    <p className="text-gray-500 max-w-sm">Tap "Start Translator" to begin real-time gestural processing.</p>
                                </div>
                            )}

                            {/* Live Overlay */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute top-6 left-6 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
                                    >
                                        <div className="relative flex">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute" />
                                            <div className="w-2 h-2 bg-green-500 rounded-full relative" />
                                        </div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Analysis</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Prediction Display */}
                        <div className="glass p-10 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <RefreshCw className="w-32 h-32 text-green-400" />
                            </div>

                            <div className="flex flex-col items-center md:items-start space-y-1">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Current Gestural Output</span>
                                <div className="flex items-center space-x-4">
                                    <h2 className={`text-5xl font-black transition-all ${prediction ? "text-green-400" : "text-white/20"}`}>
                                        {prediction || "Waiting..."}
                                    </h2>
                                    {confidence && (
                                        <span className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold">
                                            {confidence}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={prediction ? speakPrediction : undefined}
                                    disabled={!prediction}
                                    className="p-4 bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white rounded-2xl border border-white/10 transition-all group"
                                    aria-label="Read prediction aloud"
                                >
                                    <Volume2 className={`w-6 h-6 ${prediction ? "group-hover:text-green-400" : "text-gray-500"}`} />
                                </button>
                                <button
                                    onClick={isActive ? stopTranslator : startTranslator}
                                    className={`px-8 py-4 rounded-2xl font-black flex items-center space-x-3 transition-all transform active:scale-95 shadow-xl ${isActive
                                            ? "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20"
                                            : "bg-green-400 text-navy-950 hover:bg-green-300 shadow-green-400/20"
                                        }`}
                                >
                                    {isActive ? (
                                        <>
                                            <Square className="w-5 h-5 fill-current" />
                                            <span>Stop Session</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5 fill-current" />
                                            <span>Start Translator</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transcript Panel */}
                    <div className="flex flex-col space-y-6 h-full">
                        <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col h-full bg-navy-900/40">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <History className="text-green-400 w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Transcript</h2>
                                </div>
                                <button
                                    onClick={clearTranscript}
                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                    aria-label="Clear history"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-grow space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                {transcript.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                                            <History className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <p className="text-gray-600 text-sm">No gestural history captured yet.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col-reverse space-y-reverse space-y-3">
                                        {transcript.map((text, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-300 text-sm flex items-center justify-between"
                                            >
                                                <span className="font-medium">{text}</span>
                                                <span className="text-[10px] text-gray-600 font-bold uppercase">{idx + 1}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center font-bold">
                                    Autosaving to current session
                                </p>
                            </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs text-center font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
