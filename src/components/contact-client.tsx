"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Phone, Facebook, Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function ContactClient({ profile }: any) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const ensureUrl = (url: string) => {
        if (!url) return "#";
        return url.startsWith("http") ? url : `https://${url}`;
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!name || !email || !message) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            const { error: dbError } = await supabase
                .from('messages')
                .insert([{ name, email, message }]);

            if (dbError) throw dbError;

            setSent(true);
            setName("");
            setEmail("");
            setMessage("");
            setTimeout(() => setSent(false), 5000); // Reset success after 5s

        } catch (err: any) {
            console.error("Error sending message:", err);
            setError(`Failed: ${err.message || err.details || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-neutral-950 overflow-hidden flex flex-col justify-center py-20 px-6">

            {/* Background Ambience removed (moved to layout) */}


            <div className="relative z-10 max-w-4xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">Let's Connect.</h1>
                    <p className="text-neutral-400 text-xl">
                        Available for freelance projects and new opportunities.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col justify-between h-full"
                    >
                        <div>
                            <h3 className="text-white font-bold text-xl mb-6">Contact Details</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-neutral-300 group hover:text-white transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="font-mono text-sm">{profile.email || "contact@example.com"}</span>
                                </div>
                                <div className="flex items-center gap-4 text-neutral-300 group hover:text-white transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span className="font-mono text-sm">{profile.phone || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-white font-bold text-xl mb-4">Socials</h3>
                            <div className="flex gap-4">
                                {profile.linkedin && (
                                    <a href={ensureUrl(profile.linkedin)} target="_blank" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white hover:text-black transition-all flex items-center gap-2">
                                        <Linkedin className="w-4 h-4" /> LinkedIn
                                    </a>
                                )}
                                {profile.github && (
                                    <a href={ensureUrl(profile.github)} target="_blank" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white hover:text-black transition-all flex items-center gap-2">
                                        <Github className="w-4 h-4" /> GitHub
                                    </a>
                                )}
                                {profile.facebook && (
                                    <a href={ensureUrl(profile.facebook)} target="_blank" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white hover:text-black transition-all flex items-center gap-2">
                                        <Facebook className="w-4 h-4" /> Facebook
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Live Form UI */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8"
                    >
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-neutral-500 mb-2 uppercase tracking-widest">Your Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:bg-neutral-900 transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-neutral-500 mb-2 uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:bg-neutral-900 transition-colors"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-neutral-500 mb-2 uppercase tracking-widest">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:bg-neutral-900 transition-colors h-32 resize-none"
                                    placeholder="Tell me about your project..."
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                                    <p className="text-red-400 text-xs font-bold">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || sent}
                                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${sent ? "bg-green-500 text-white" : "bg-white text-black hover:bg-neutral-200 shadow-white/10"
                                    }`}
                            >
                                {loading ? (
                                    <> <Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                                ) : sent ? (
                                    <> <CheckCircle2 className="w-5 h-5" /> Message Sent!</>
                                ) : (
                                    <> Send Message <Send className="w-4 h-4" /> </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
