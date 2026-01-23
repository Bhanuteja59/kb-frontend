"use client";

import { useState } from "react";
import { z } from "zod";
import { Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
    email: z.string().email(),
    full_name: z.string().min(2),
    password: z.string().min(8),
    hoa_name: z.string().optional(),
    role: z.enum(["BOARD_ADMIN", "RESIDENT"]),
    tenant_slug: z.string().optional(),
});

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [hoaName, setHoaName] = useState("");
    const [tenantSlug, setTenantSlug] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("BOARD_ADMIN");
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        setIsLoading(true);
        setErr(null);
        try {
            const parsed = schema.safeParse({ email, full_name: fullName, password, hoa_name: hoaName || undefined, role, tenant_slug: tenantSlug || undefined });
            if (!parsed.success) {
                setErr("Please check your input.");
                return;
            }

            const res = await fetch("http://localhost:8000/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setErr(errorData.detail?.message || "Registration failed.");
                return;
            }

            // Login immediately after registration? Or redirect to login?
            // For now, redirect to login
            router.push("/login?registered=true");
        } catch (e) {
            setErr("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Command className="mr-2 h-6 w-6" />
                    HOA SaaS Platform
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Join thousands of communities managing their HOAs efficiently.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details below to create your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Input
                                    placeholder="Full Name"
                                    type="text"
                                    disabled={isLoading}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="mb-2"
                                />
                                <Input
                                    placeholder="HOA / Community Name (Optional)"
                                    type="text"
                                    disabled={isLoading}
                                    value={hoaName}
                                    onChange={(e) => setHoaName(e.target.value)}
                                    className="mb-2"
                                />
                                <Input
                                    placeholder="Community Code (Leave blank if creating new HOA)"
                                    type="text"
                                    disabled={isLoading}
                                    value={tenantSlug}
                                    onChange={(e) => setTenantSlug(e.target.value)}
                                    className="mb-2"
                                />
                                <Input
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mb-2"
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    autoCapitalize="none"
                                    disabled={isLoading}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2 mb-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I am a...
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="admin"
                                            name="role"
                                            value="BOARD_ADMIN"
                                            checked={role === "BOARD_ADMIN"}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="accent-primary"
                                        />
                                        <label htmlFor="admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Board Admin
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="resident"
                                            name="role"
                                            value="RESIDENT"
                                            checked={role === "RESIDENT"}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="accent-primary"
                                        />
                                        <label htmlFor="resident" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Resident
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <Button disabled={isLoading} onClick={handleRegister}>
                                {isLoading && (
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                )}
                                Sign Up
                            </Button>
                        </div>
                        {err && <p className="text-sm text-destructive text-center">{err}</p>}
                    </div>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
