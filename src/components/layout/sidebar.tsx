"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Wallet,
    Sun,
    LogOut
} from "lucide-react";
import { navigation } from "@/src/config/menuSIdebar";
import { createClient } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState("");

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then((res) => {
            setUser(res.data.user?.user_metadata.name ?? "");
        });
    }, []);

    async function handleLogout() {
        const supabase = createClient();

        await supabase.auth.signOut();
        router.push("/login");
    }


    return (
        <>
            {/* === DESKTOP SIDEBAR === */}
            <aside className="sticky top-0 hidden md:flex h-screen w-64 flex-col border-r border-[#2D2A54] bg-[#0C0A20] px-4 py-6">
                <div className="mb-10 flex items-center gap-2.5 px-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand shadow-[0_0_16px_rgba(108,99,245,0.4)]">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-text-primary">Budgy</span>
                </div>

                <nav className="flex flex-1 flex-col gap-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
                                    ? "bg-brand/10 text-brand"
                                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2 text-text-secondary">
                        <button type="button" className="transition-colors hover:text-text-primary">
                            <Sun className="h-5 w-5" />
                        </button>
                        <button onClick={handleLogout} type="button" className="transition-colors hover:text-text-primary">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                            {user.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-medium text-text-primary">{user.toLowerCase()}</span>
                            <span className="truncate text-xs text-text-secondary">Pro Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* === MOBILE BOTTOM NAV === */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#2D2A54] bg-[#0C0A20] pb-2 pt-2 px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${isActive ? "text-brand" : "text-text-secondary hover:text-text-primary"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
