"use client";

import React, { useState } from "react";
import {
    Home,
    User,
    Briefcase,
    Mail,
    Menu,
    X,
    Github,
    Linkedin,
    Facebook
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const navItems = [
    { name: "Home", link: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Projects", link: "/projects", icon: <Briefcase className="w-5 h-5" /> },
    { name: "About", link: "/about", icon: <User className="w-5 h-5" /> },
    { name: "Contact", link: "/contact", icon: <Mail className="w-5 h-5" /> },
];

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [socials, setSocials] = useState<any>({});

    React.useEffect(() => {
        const fetchSocials = async () => {
            const { data } = await supabase.from('personal_info').select('github_link, linkedin_link, facebook_link').limit(1).single();
            if (data) setSocials(data);
        };
        fetchSocials();
    }, []);

    const ensureUrl = (url: string) => {
        if (!url) return "#";
        return url.startsWith("http") ? url : `https://${url}`;
    };

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-neutral-900 rounded-full text-white shadow-lg border border-neutral-800"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className={cn(
                "fixed left-0 top-0 h-screen w-64 bg-neutral-950/80 backdrop-blur-xl border-r border-neutral-800 p-6 flex flex-col justify-between z-40 transition-transform duration-300 transform md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div>
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                            Tonmoy.dev
                        </span>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item, idx) => {
                            const isActive = pathname === item.link;
                            return (
                                <Link
                                    key={idx}
                                    href={item.link}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-blue-600/10 text-blue-500"
                                            : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                                    )}>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-blue-600/10 rounded-xl"
                                            />
                                        )}
                                        <span className="relative z-10">{item.icon}</span>
                                        <span className="relative z-10 font-medium">{item.name}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="pt-6 border-t border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-4 uppercase tracking-wider font-semibold">Connect</p>
                    <div className="flex gap-4">
                        {socials.github_link && (
                            <a href={ensureUrl(socials.github_link)} target="_blank" className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-blue-600 transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                        {socials.linkedin_link && (
                            <a href={ensureUrl(socials.linkedin_link)} target="_blank" className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-blue-600 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        )}
                        {socials.facebook_link && (
                            <a href={ensureUrl(socials.facebook_link)} target="_blank" className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-blue-600 transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};
