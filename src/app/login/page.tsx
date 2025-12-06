"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { ensurePath } from "@/lib/utils";

function LoginForm() {
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

            let legacySuccess = false;
            let legacyMessage = "";

            if (authError) {
                console.warn("Supabase Auth failed:", authError.message);

                // Fallback attempt (Legacy)
                // We wrap this in a TRY/CATCH to ensure it never crashes the main flow
                try {
                    const res = await loginAction(email, password);
                    if (res.success) {
                        legacySuccess = true;
                    } else {
                        // Store legacy message but don't show yet
                        legacyMessage = res.message || "Legacy auth failed";
                    }
                } catch (legacyEx: any) {
                    console.warn("Legacy Auth Exception:", legacyEx);
                    // Expected on GitHub Pages, so we just ignore this crash and rely on authError
                }
            }

            // Success Condition: Either Supabase worked (no error) OR Legacy worked
            if (!authError || legacySuccess) {
                // Set Cookie
                document.cookie = "admin_session=true; path=/; SameSite=Strict";

                // Redirect
                const nextUrl = searchParams.get("next") || "/login/studio";
                router.push(nextUrl);
            } else {
                // Failure Condition
                // Show the specific error message to the user!
                setError(authError?.message || legacyMessage || "Invalid Credentials");
            }

        } catch (err: any) {
            // CRITICAL: We now show the actual crash error to the user
            console.error("Critical Login Error:", err);
            setError("App Error: " + (err.message || String(err)));
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
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg break-words">
                            <p className="text-red-400 text-xs text-center font-medium">{error}</p>
                        </div>
                    )}

                    <div className="text-xs text-center text-neutral-600">
                        {process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ? "⚠️ Demo Mode: Login might fail without keys" : "Connected to Supabase"}
                    </div>

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

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}

// Mock Server Action wrapper for this client file
async function loginAction(email: string, pwd: string) {
    try {
        const response = await fetch(ensurePath('/api/auth/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pwd })
        });

        // On GitHub Pages, API routes return 404 HTML, which causes .json() to crash.
        // We must check .ok first.
        if (!response.ok) {
            return { success: false, message: `Server Error: ${response.status}` };
        }

        const data = await response.json();
        return { success: response.ok, message: data.message };
    } catch (e: any) {
        // Network errors or fetch failures
        return { success: false, message: e.message || "Network Error" };
    }
}
