import React from "react";
import Link from "next/link";
import { Accessibility, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-navy-950 border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
                                <Accessibility className="text-navy-950 w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">OpenVoice</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm">
                            Empowering accessibility through modern AI and intuitive design.
                            Bridging the gap for everyone, everywhere.
                        </p>
                        <div className="flex space-x-4">
                            <button aria-label="Twitter" className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-accent-blue">
                                <Twitter className="w-5 h-5" />
                            </button>
                            <button aria-label="Github" className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-accent-blue">
                                <Github className="w-5 h-5" />
                            </button>
                            <button aria-label="LinkedIn" className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-accent-blue">
                                <Linkedin className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/sign-language" className="hover:text-accent-blue transition-colors">Sign Language</Link></li>
                            <li><Link href="/voice-assistant" className="hover:text-accent-blue transition-colors">Voice Assistant</Link></li>
                            <li><Link href="/image-describer" className="hover:text-accent-blue transition-colors">Image Describer</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/settings" className="hover:text-accent-blue transition-colors">Settings</Link></li>
                            <li><Link href="#" className="hover:text-accent-blue transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-accent-blue transition-colors">Help Center</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} OpenVoice. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
