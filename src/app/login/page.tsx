"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { ensurePath } from "@/lib/utils";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // 1. Client-Side Auth (Establishes Session in Browser for RLS)
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) {
                // Fallback: If auth fails, try Legacy Env Password check via Server
                // This supports the "password only" mode if user hasn't set up Auth users properly yet
                console.warn("Supabase Auth failed, trying legacy:", authError.message);
            }

            // 2. Server-Side Cookie (Satisfies Middleware)
            // We pass credentials to verify on server too (or just to set cookie)
            const res = await loginAction(email, password);

            if (res.success || !authError) {
                // IMPORTANT: Set cookie on Client Side for Static Export compat
                // Removed max-age to make it a Session Cookie (clears on browser close)
                document.cookie = "admin_session=true; path=/; SameSite=Strict";

                // If EITHER Supabase Auth worked OR Legacy Auth worked -> Redirect
                const nextUrl = searchParams.get("next") || "/studio";
                router.push(nextUrl);
            } else {
                setError(authError?.message || res.message || "Invalid Credentials");
            }

        } catch (err: any) {
            setError("Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-neutral-800 rounded-full">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-white mb-2">Studio Access</h1>
                <p className="text-neutral-500 text-center text-sm mb-8">Sign in with your admin credentials.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-center"
                            autoFocus
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-center tracking-widest"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-xs text-center font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                    >
                        Sign In <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

// Mock Server Action wrapper for this client file
async function loginAction(email: string, pwd: string) {
    const response = await fetch(ensurePath('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: pwd })
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
}
