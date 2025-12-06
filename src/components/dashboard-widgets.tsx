"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, MapPin, Github, Code2, Terminal, GraduationCap } from "lucide-react";

// Types for Widget Props
interface LocationWidgetProps {
    location?: string;
}

interface TechStackWidgetProps {
    expertise?: any[];
}

interface BioWidgetProps {
    bio?: string;
}

interface EducationStatsWidgetProps {
    stats?: any;
}

interface CopyEmailWidgetProps {
    email?: string;
}

// --- Clock & Location Widget ---
export const LocationWidget = ({ location = "Dhaka, Bangladesh" }: LocationWidgetProps) => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Dhaka",
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col justify-between h-full w-full p-6 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex justify-between items-start z-10">
                <div className="p-3 bg-neutral-800/50 rounded-full">
                    <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-mono text-green-400">Online</span>
                </div>
            </div>

            <div className="z-10">
                <h3 className="text-3xl font-bold text-white mb-1">{time}</h3>
                <p className="text-neutral-400 text-sm font-mono">{location}</p>
            </div>
        </div>
    );
};

// --- Tech Stack Widget (Dynamic) ---
export const TechStackWidget = ({ expertise = [] }: TechStackWidgetProps) => {
    // Flatten skills or show a default set if empty
    const displaySkills = expertise && expertise.length > 0
        ? expertise.flatMap((e: any) => e.skills).slice(0, 8)
        : ["React", "Next.js", "TypeScript", "Tailwind"];

    return (
        <div className="h-full w-full bg-neutral-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Code2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-neutral-200">Expertise</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                    {displaySkills.map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-xs font-medium text-neutral-300 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-colors">
                            {tech}
                        </span>
                    ))}
                </div>
                {expertise && expertise.length > 0 && (
                    <p className="text-xs text-neutral-500 mt-2 truncate">
                        {expertise.map((e: any) => e.category).join(" • ")}
                    </p>
                )}
            </div>
        </div>
    );
};

// --- Copy Email Widget ---
export const CopyEmailWidget = ({ email = "hello@example.com" }: CopyEmailWidgetProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex flex-col justify-center items-center h-full w-full p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl relative overflow-hidden group cursor-pointer transition-transform active:scale-95"
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="z-10 bg-white/20 p-4 rounded-full mb-4 ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-300">
                {copied ? <Check className="w-6 h-6 text-white" /> : <Copy className="w-6 h-6 text-white" />}
            </div>

            <p className="text-white font-medium z-10">
                {copied ? "Email Copied!" : "Copy Email"}
            </p>
            <p className="text-blue-200 text-xs z-10 opacity-60 mt-1 font-mono">{email}</p>
        </button>
    );
};

// --- GitHub Activity Mock Widget ---
export const GithubActivityWidget = () => {
    const weeks = 14;
    const days = 7;
    const [data, setData] = useState<number[]>([]);

    useEffect(() => {
        setData(Array.from({ length: weeks * days }).map(() => Math.floor(Math.random() * 4)));
    }, []);

    const colors = [
        "bg-neutral-800",       // Level 0
        "bg-green-900",         // Level 1
        "bg-green-700",         // Level 2
        "bg-green-500",         // Level 3
    ];

    return (
        <div className="flex flex-col h-full w-full p-6 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">GitHub Activity</span>
                </div>
                <span className="text-xs text-neutral-500 font-mono">Last 3 Months</span>
            </div>

            <div className="flex gap-1 items-end h-full">
                {Array.from({ length: weeks }).map((_, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-1">
                        {Array.from({ length: days }).map((_, dayIdx) => {
                            const level = data.length > 0 ? data[weekIdx * days + dayIdx] : 0;
                            return (
                                <div
                                    key={dayIdx}
                                    className={`w-3 h-3 rounded-sm ${colors[level]} opacity-80 hover:opacity-100 transition-opacity`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Bio / Summary Widget ---
export const BioWidget = ({ bio = "Full Stack Developer" }: BioWidgetProps) => {
    return (
        <div className="flex flex-col h-full w-full p-6 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-white font-bold">Professional Summary</h3>
            </div>

            <div className="relative z-10 space-y-4">
                <p className="text-neutral-400 text-sm leading-relaxed">
                    {bio}
                </p>
                <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-neutral-300 border border-white/5">Problem Solving</span>
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-neutral-300 border border-white/5">Leadership</span>
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-neutral-300 border border-white/5">Adaptability</span>
                </div>
            </div>
        </div>
    );
};

// --- Education & Stats Widget (Dynamic List) ---
export const EducationStatsWidget = ({ educationList }: { educationList?: any[] }) => {
    // If no list, show empty state or fallback
    if (!educationList || educationList.length === 0) {
        return (
            <div className="flex flex-col h-full w-full p-6 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl relative overflow-hidden">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="font-bold text-neutral-200">Education</h3>
                </div>
                <p className="text-neutral-500 text-xs">No education details added.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full p-6 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4 shrink-0">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="font-bold text-neutral-200">Education</h3>
                </div>

                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {educationList.map((edu, idx) => (
                        <div key={idx} className="border-l-2 border-white/10 pl-4 py-1">
                            <h4 className="text-white font-bold text-sm leading-tight">{edu.institution}</h4>
                            <p className="text-blue-200 text-xs font-medium mt-1">{edu.degree}</p>
                            <div className="flex gap-3 text-[10px] text-neutral-500 mt-1 font-mono uppercase tracking-wider">
                                <span>{edu.year}</span>
                                {edu.result && <span>• {edu.result}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Languages Widget ---
export const LanguagesWidget = () => {
    const langs = [
        { name: "English", level: "Professional" },
        { name: "Bangla", level: "Native" },
        { name: "Hindi", level: "Conversational" },
    ];

    return (
        <div className="flex flex-col justify-center h-full w-full p-6 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl relative overflow-hidden group">
            <h3 className="text-neutral-400 text-xs font-mono uppercase tracking-widest mb-4">Languages</h3>
            <div className="space-y-3">
                {langs.map((l, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                        <span className="text-white text-sm font-medium">{l.name}</span>
                        <span className="text-xs text-neutral-500">{l.level}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
