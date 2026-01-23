import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const res = await fetch("http://localhost:8000/api/v1/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) {
                        console.error("Login failed:", res.status, await res.text());
                        return null;
                    }

                    const user = await res.json();
                    if (user && user.access_token) {
                        return {
                            id: user.user_id,
                            email: credentials.email,
                            name: "User",
                            accessToken: user.access_token,
                            tenantId: user.tenant_id,
                            tenant_slug: user.tenant_slug,
                            roles: user.roles,
                        };
                    }
                    return null;
                } catch (e) {
                    console.error("Auth error:", e);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.tenantId = user.tenantId;
                token.id = user.id;
                // @ts-ignore
                token.tenant_slug = user.tenant_slug;
                // @ts-ignore
                token.roles = user.roles;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.accessToken = token.accessToken as string;
                session.user.tenantId = token.tenantId as string;
                // @ts-ignore
                session.tenant_slug = token.tenant_slug as string;
                // @ts-ignore
                session.roles = token.roles as string[];
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
};
