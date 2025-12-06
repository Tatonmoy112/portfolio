"use client";

import { usePathname } from "next/navigation";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Home, Briefcase, User, Mail } from "lucide-react";

export function ConditionalFloatingDock() {
    const pathname = usePathname();
    const isStudio = pathname?.startsWith("/studio");
    const isLogin = pathname?.startsWith("/login");

    if (isStudio || isLogin) return null;

    const navItems = [
        { title: "Home", icon: <Home className="h-full w-full text-neutral-300" />, href: "/" },
        { title: "Projects", icon: <Briefcase className="h-full w-full text-neutral-300" />, href: "/projects" },
        { title: "About", icon: <User className="h-full w-full text-neutral-300" />, href: "/about" },
        { title: "Contact", icon: <Mail className="h-full w-full text-neutral-300" />, href: "/contact" },
    ];



    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <FloatingDock items={navItems} />
        </div>
    );
}
