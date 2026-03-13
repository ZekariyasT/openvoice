"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    Accessibility,
    Volume2,
    Languages,
    Image as ImageIcon,
    Settings
} from "lucide-react";
import AccessibilityToggle from "./AccessibilityToggle";

const navLinks = [
    { name: "Sign Language", href: "/sign-language", icon: Languages },
    { name: "Voice Assistant", href: "/voice-assistant", icon: Volume2 },
    { name: "Image Describer", href: "/image-describer", icon: ImageIcon },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass py-3" : "bg-transparent py-5"
                }`}
            aria-label="Main Navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 group"
                        aria-label="OpenVoice Home"
                    >
                        <div className="w-10 h-10 bg-accent-blue rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Accessibility className="text-navy-950 w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white group-hover:text-accent-bright transition-colors">
                            OpenVoice
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-accent-bright ${pathname === link.href ? "text-accent-blue" : "text-gray-300"
                                    }`}
                                aria-current={pathname === link.href ? "page" : undefined}
                            >
                                <link.icon className="w-4 h-4" />
                                <span>{link.name}</span>
                            </Link>
                        ))}

                        <AccessibilityToggle />
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center space-x-4">
                        <AccessibilityToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-accent-blue transition-colors"
                            aria-expanded={isOpen}
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute top-full left-0 w-full glass transition-all duration-300 transform ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="px-4 pt-2 pb-6 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname === link.href ? "bg-accent-blue/10 text-accent-blue" : "text-gray-300 hover:bg-white/5"
                                }`}
                        >
                            <link.icon className="w-5 h-5" />
                            <span className="text-lg font-medium">{link.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
