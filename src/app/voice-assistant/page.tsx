"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Mic,
    Volume2,
    Copy,
    Play,
    Square,
    Globe,
    Trash2,
    VolumeX,
    Languages,
    ArrowRight,
    Sparkles,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Language options
const LANGUAGES = [
    { name: "English", code: "en-US" },
    { name: "Arabic", code: "ar-SA" },
    { name: "French", code: "fr-FR" },
    { name: "Spanish", code: "es-ES" },
];

export default function VoiceAssistantPage() {
    // STT States
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [sttLang, setSttLang] = useState("en-US");
    const recognitionRef = useRef<any>(null);

    // TTS States
    const [ttsText, setTtsText] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>("");
    const [speed, setSpeed] = useState(1);
    const [pitch, setPitch] = useState(1);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let interim = "";
                let final = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }

                setInterimTranscript(interim);
                if (final) {
                    setTranscript(prev => prev + (prev ? " " : "") + final);
                }
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
                setInterimTranscript("");
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                setIsRecording(false);
            };
        }

        // Initialize TTS
        synthRef.current = window.speechSynthesis;
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(availableVoices[0].name);
            }
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (synthRef.current) synthRef.current.cancel();
        };
    }, [selectedVoice]);

    // STT Handlers
    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            setInterimTranscript("");
            recognitionRef.current.lang = sttLang;
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const copyTranscript = () => {
        navigator.clipboard.writeText(transcript);
    };

    // TTS Handlers
    const handlePlay = () => {
        if (!synthRef.current || !ttsText) return;

        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(ttsText);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        utterance.rate = speed;
        utterance.pitch = pitch;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        synthRef.current.speak(utterance);
    };

    const handleStop = () => {
        synthRef.current?.cancel();
        setIsPlaying(false);
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-navy-950">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-widest"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Voice Intelligence</span>
                    </motion.div>
                    <h1 className="text-5xl font-black text-white tracking-tight">
                        Voice <span className="text-accent-blue">Assistant</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        High-fidelity speech-to-text and emotive text-to-speech engine.
                        Bridge communication gaps with state-of-the-art neural processing.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* LEFT PANEL: VOICE TO TEXT */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-full min-h-[600px]"
                    >
                        <div className="p-8 space-y-8 flex-grow flex flex-col">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-accent-blue/10 rounded-lg">
                                        <Mic className="text-accent-blue w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Live Recorder</h2>
                                </div>

                                <select
                                    value={sttLang}
                                    onChange={(e) => setSttLang(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent-blue transition-colors outline-none"
                                >
                                    {LANGUAGES.map(lang => (
                                        <option key={lang.code} value={lang.code} className="bg-navy-900">
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Mic Area */}
                            <div className="flex flex-col items-center justify-center py-10 space-y-6">
                                <div className="relative">
                                    <AnimatePresence>
                                        {isRecording && (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1.5, opacity: 0.3 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                                className="absolute inset-0 bg-accent-blue rounded-full blur-2xl"
                                            />
                                        )}
                                    </AnimatePresence>
                                    <button
                                        onClick={toggleRecording}
                                        className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isRecording
                                                ? "bg-red-500 rotate-90 scale-110 shadow-red-500/40"
                                                : "bg-accent-blue hover:scale-110 shadow-accent-blue/30"
                                            }`}
                                    >
                                        {isRecording ? (
                                            <Square className="w-12 h-12 text-white fill-current" />
                                        ) : (
                                            <Mic className="w-12 h-12 text-navy-950" />
                                        )}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <p className={`text-xl font-bold transition-all ${isRecording ? "text-red-500 animate-pulse" : "text-white"}`}>
                                        {isRecording ? "Listening..." : "Ready to Record"}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {isRecording ? "Tap to stop" : "Click the mic to begin"}
                                    </p>
                                </div>
                            </div>

                            {/* Result Area */}
                            <div className="flex-grow flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transcript</span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setTranscript("")}
                                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                            title="Clear"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={copyTranscript}
                                            className="p-2 text-gray-500 hover:text-accent-blue transition-colors"
                                            title="Copy"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative flex-grow bg-white/[0.02] border border-white/5 rounded-2xl p-6 overflow-y-auto max-h-[300px] custom-scrollbar">
                                    {!transcript && !interimTranscript && (
                                        <p className="text-gray-600 italic">Spoken words will appear here...</p>
                                    )}
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {transcript}
                                        {interimTranscript && (
                                            <span className="text-accent-blue/60 ml-1">{interimTranscript}</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT PANEL: TEXT TO SPEECH */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-full min-h-[600px]"
                    >
                        <div className="p-8 space-y-8 flex-grow flex flex-col">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-accent-blue/10 rounded-lg">
                                    <Volume2 className="text-accent-blue w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Speech Synthesizer</h2>
                            </div>

                            {/* Input Area */}
                            <div className="space-y-4 flex-grow flex flex-col">
                                <textarea
                                    value={ttsText}
                                    onChange={(e) => setTtsText(e.target.value)}
                                    placeholder="Type or paste text to convert to speech..."
                                    className="w-full flex-grow min-h-[250px] bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-accent-blue focus:bg-white/[0.04] transition-all resize-none outline-none custom-scrollbar"
                                />
                            </div>

                            {/* Controls */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                                            <Languages className="w-3 h-3 mr-2" /> Voice Selection
                                        </label>
                                        <select
                                            value={selectedVoice}
                                            onChange={(e) => setSelectedVoice(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-accent-blue transition-colors"
                                        >
                                            {voices.map(voice => (
                                                <option key={voice.name} value={voice.name} className="bg-navy-900">
                                                    {voice.name} ({voice.lang})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                                Speed <span>{speed.toFixed(1)}x</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="2"
                                                step="0.1"
                                                value={speed}
                                                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                                className="w-full accent-accent-blue bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                                Pitch <span>{pitch.toFixed(1)}</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="2"
                                                step="0.1"
                                                value={pitch}
                                                onChange={(e) => setPitch(parseFloat(e.target.value))}
                                                className="w-full accent-accent-blue bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={handlePlay}
                                        disabled={isPlaying || !ttsText}
                                        className="flex-grow py-4 bg-accent-blue hover:bg-accent-bright disabled:opacity-50 disabled:hover:bg-accent-blue text-navy-950 font-black rounded-2xl flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98]"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        <span>Generate Audio</span>
                                    </button>
                                    <button
                                        onClick={handleStop}
                                        disabled={!isPlaying}
                                        className="px-6 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all outline-none"
                                    >
                                        <Square className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
