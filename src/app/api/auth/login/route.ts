import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

// Simple in-memory rate limiter (Note: resets on server restart/redeploy)
const ratelimit = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: Request) {
    // Get IP (Mocking IP for local/edge environment retrieval)
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    const now = Date.now();
    const windowTime = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;

    const record = ratelimit.get(ip) || { count: 0, lastAttempt: now };

    // Reset if window passed
    if (now - record.lastAttempt > windowTime) {
        record.count = 0;
        record.lastAttempt = now;
    }

    if (record.count >= maxAttempts) {
        return NextResponse.json(
            { success: false, message: "Too many attempts. Try again in 15 minutes." },
            { status: 429 }
        );
    }

    const body = await request.json();
    // Support both new Email+Pass and old Pass-only
    const success = await login(body.password, body.email);

    if (success) {
        // Reset on success
        ratelimit.delete(ip);
        return NextResponse.json({ success: true }, { status: 200 });
    } else {
        // Increment on failure
        record.count += 1;
        record.lastAttempt = now;
        ratelimit.set(ip, record);
        return NextResponse.json({ success: false }, { status: 401 });
    }
}
