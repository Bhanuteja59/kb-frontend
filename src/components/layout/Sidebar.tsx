"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Wrench,
    Users,
    Building2,
    Megaphone,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Announcements & Docs", href: "/dashboard/announcements-documents", icon: Megaphone },
    { name: "Work Orders", href: "/dashboard/work-orders", icon: Wrench },
    { name: "Violations & ARC", href: "/dashboard/violations-arc", icon: Building2 }, // Using Building2 as a placeholder
    { name: "Residents & Units", href: "/dashboard/residents-units", icon: Users },
    { name: "Dues & Ledger", href: "/dashboard/dues-ledger", icon: FileText }, // Using FileText as a placeholder
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
    className?: string;
    onNavigate?: () => void;
}

export default function Sidebar({ className, onNavigate }: SidebarProps) {
    const pathname = usePathname();
    const { data: session }: any = useSession();
    const roles = session?.roles || [];
    const isAdmin = roles.includes("ADMIN");

    return (
        <div className={cn("flex h-full w-64 flex-col border-r bg-card/50 backdrop-blur-xl transition-all duration-300", className)}>
            <div className="flex h-16 items-center border-b border-border/50 px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent" onClick={onNavigate}>
                    <Building2 className="h-6 w-6 text-primary" />
                    <span>HOA Platform</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-3 text-sm font-medium space-y-1">
                    {sidebarItems.map((item, index) => {
                        if (item.name === "Residents & Units" && !isAdmin) return null;
                        if (item.name === "Jobs" && !isAdmin) return null;

                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] font-semibold"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:translate-x-1"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t border-border/50">
                <div className="rounded-xl border border-border/50 bg-background/50 p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {session?.user?.name?.substring(0, 2).toUpperCase() || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-xs font-medium">{session?.user?.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{session?.tenant_slug}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground h-8" onClick={() => signOut({ callbackUrl: "/login" })}>
                        <LogOut className="mr-2 h-3 w-3" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
