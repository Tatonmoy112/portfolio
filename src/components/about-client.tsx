"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

export function AboutClient({ profile, expertise, education }: any) {
    return (
        <div className="min-h-screen relative bg-neutral-950 overflow-hidden pt-24 pb-20 px-6">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-neutral-950 opacity-90 z-0">
                <StarsBackground />
                <ShootingStars />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* Left Column: Bio & Education */}
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white mb-8"
                        >
                            About Me.
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="prose prose-invert text-neutral-400 mb-12"
                        >
                            <p className="whitespace-pre-wrap">
                                {profile.bio}
                            </p>
                        </motion.div>

                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            Education
                            <div className="h-px bg-white/10 flex-1" />
                        </h2>

                        <div className="space-y-8 border-l border-white/10 ml-3 pl-8 relative">
                            {education.map((item: any, idx: number) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-neutral-950" />
                                    <h3 className="text-lg font-bold text-white">{item.degree}</h3>
                                    <p className="text-blue-400 text-sm mb-2">{item.institution} • {item.year}</p>
                                    <p className="text-neutral-500 text-sm">{item.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Skills */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 sticky top-24"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Expertise</h3>

                            <div className="space-y-8">
                                {expertise.map((exp: any, idx: number) => (
                                    <div key={idx}>
                                        <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4">{exp.category}</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {exp.skills.map((skill: string, sIdx: number) => (
                                                <div key={sIdx} className="flex items-center gap-2 text-neutral-300 bg-white/5 border border-white/5 px-3 py-2 rounded-lg text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
