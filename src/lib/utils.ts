import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function ensurePath(path: string | undefined | null) {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("//")) return path;

    // Production: use repository name
    const basePath = "/portfolio";
    // const basePath = ""; // Reset for local dev

    // Avoid double prefixing
    if (basePath && path.startsWith(basePath)) return path;

    return `${basePath}${path.startsWith("/") ? "" : "/"}${path}`;
}
