"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

export function ProjectsClient({ projects }: { projects: any[] }) {
    return (
        <div className="min-h-screen relative bg-neutral-950 overflow-hidden pt-20 pb-20 px-6">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-neutral-950 opacity-90 z-0">
                <StarsBackground />
                <ShootingStars />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6">
                        Selected Works
                    </h1>
                    <p className="text-neutral-400 max-w-xl mx-auto text-lg">
                        A showcase of my technical projects and design explorations.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:bg-neutral-900/60 transition-colors"
                        >
                            <div className="aspect-video bg-neutral-800/50 relative overflow-hidden border-b border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {project.image && project.image !== "/project1.jpg" && project.image !== "/project2.jpg" && project.image !== "/project3.jpg" ? (
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-500 font-mono text-sm tracking-widest">
                                        PREVIEW
                                    </div>
                                )}
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-blue-400 mb-2 block">{project.category}</span>
                                        <h3 className="text-2xl font-bold text-neutral-200 group-hover:text-white transition-colors">
                                            {project.title}
                                        </h3>
                                    </div>
                                    <div className="flex gap-2">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-white/5 border border-white/10 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                                                title="View Source"
                                            >
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white/5 border border-white/10 rounded-full text-neutral-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all"
                                            title="View Project"
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>

                                <p className="text-neutral-400 mb-6 leading-relaxed text-sm">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {(project.tags || []).map((tag: string, tIdx: number) => (
                                        <span key={tIdx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}
