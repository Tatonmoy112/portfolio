"use client";

import React from "react";
import { motion } from "framer-motion";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Link from "next/link";
import { Download } from "lucide-react";
import {
    LocationWidget,
    TechStackWidget,
    CopyEmailWidget,
    GithubActivityWidget,
    BioWidget,
    EducationStatsWidget,
    LanguagesWidget
} from "@/components/dashboard-widgets";

export function HomeClient({ profile, expertise, educationList, posts }: any) {
    return (
        <div className="min-h-screen w-full relative bg-neutral-950 overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 bg-neutral-950 opacity-90 z-0 pointer-events-none">
                <StarsBackground />
                <ShootingStars />
            </div>

            <div className="relative z-10 flex flex-col items-center pt-20 pb-40 px-4">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center mb-16 max-w-4xl mx-auto"
                >
                    <div className="mb-8 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <img
                            src="/Tanvir.jpg"
                            alt={profile.name}
                            className="relative w-40 h-40 md:w-56 md:h-56 rounded-full object-cover object-top border-4 border-neutral-800 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-2xl"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=000&color=fff";
                            }}
                        />
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 tracking-tighter mb-6 whitespace-nowrap">
                        {profile?.name || "Loading..."}
                    </h1>

                    <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
                        <span className="text-blue-400 font-medium">{profile?.role}</span>.
                        Developing functional digital solutions spanning mobile apps, web interfaces, and user-focused system designs.
                    </p>

                    <div className="flex gap-4 mb-12">
                        <Link href="/projects" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10">
                            View Projects
                        </Link>
                        <a
                            href={profile?.resume_url || profile?.resumeUrl || "/resume.pdf"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-neutral-900 border border-neutral-800 text-white font-medium rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Download className="w-4 h-4" /> Download CV
                        </a>
                    </div>
                </motion.div>

                {/* Advanced Dashboard V7 Grid - 3 Column Layout */}
                <motion.div
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5"
                >
                    {/* --- Row 1: Identity (Wide Bio + Live Info) --- */}
                    <div className="md:col-span-2 h-[180px]">
                        <BioWidget bio={profile.bio} />
                    </div>
                    <div className="md:col-span-1 h-[180px]">
                        <LocationWidget location={profile.location} />
                    </div>

                    {/* --- Row 2: Contribution & Skills --- */}
                    <div className="md:col-span-2 h-[180px]">
                        <GithubActivityWidget />
                    </div>
                    <div className="md:col-span-1 h-[180px]">
                        <TechStackWidget expertise={expertise} />
                    </div>

                    {/* --- Row 3: Quick Stats Cluster --- */}
                    <div className="md:col-span-1 h-[180px]">
                        <LanguagesWidget />
                    </div>
                    <div className="md:col-span-1 h-[180px]">
                        <EducationStatsWidget educationList={educationList} />
                    </div>
                    <div className="md:col-span-1 h-[180px]">
                        <CopyEmailWidget email={profile.email} />
                    </div>

                    {/* --- Row 4: Latest Social Post (Facebook Style) --- */}
                    {posts.length > 0 ? (
                        <div className={`md:col-span-3 grid grid-cols-1 ${posts.length === 1 ? 'md:grid-cols-1' :
                            posts.length === 2 ? 'md:grid-cols-2' :
                                posts.length === 3 ? 'md:grid-cols-3' :
                                    posts.length === 4 ? 'md:grid-cols-2' :
                                        posts.length === 5 ? 'md:grid-cols-6' :
                                            'md:grid-cols-3'
                            } gap-5`}>
                            {posts.map((post: any, index: number) => (
                                <div key={post.id} className={`${posts.length === 5 ? (index < 3 ? 'md:col-span-2' : 'md:col-span-3') : 'col-span-1'
                                    } h-auto min-h-[240px] bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col gap-4 group hover:border-white/10 transition-colors`}>
                                    {/* Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                            <img src="/Tanvir.jpg" alt="Profile" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profile?.name}&background=random`} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{profile?.name || "Tanvir Ahmed"}</h4>
                                            <p className="text-neutral-500 text-xs font-mono">
                                                {new Date(post.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })} • Public
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {post.content}
                                    </p>

                                    {/* Image Attachment */}
                                    {post.image && (
                                        <div className="w-full h-48 rounded-2xl overflow-hidden border border-neutral-800 bg-black/50 mt-auto">
                                            <img src={post.image} alt="Post Attachment" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty State or Placeholder
                        <div className="md:col-span-3 h-[240px] flex items-center justify-center rounded-3xl bg-neutral-900/20 border border-white/5 border-dashed">
                            <p className="text-neutral-600 font-mono text-sm">No recent updates posted.</p>
                        </div>
                    )}

                </motion.div>

            </div >
        </div >
    );
}
