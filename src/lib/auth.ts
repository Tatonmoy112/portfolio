import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

export async function login(password: string, email?: string) {
    // 1. Legacy/Env Password Check (if only password provided or explicitly using Env var)
    if (password === ADMIN_PASSWORD && !email) {
        await createSession();
        return true;
    }

    // 2. Supabase Auth Check (if email provided)
    if (email) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (!error && data.user) {
            await createSession(); // Persist session for middleware
            return true;
        }
    }

    return false;
}

async function createSession() {
    const cookieStore = await cookies();
    // Set a cookie that expires in 1 day
    cookieStore.set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
}

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    return !!session?.value;
}
