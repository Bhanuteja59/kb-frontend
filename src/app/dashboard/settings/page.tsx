"use client";

import { useSession } from "next-auth/react";
import { apiGet, apiPostJson } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Shield, Code, Server } from "lucide-react";

export default function SettingsPage() {
  const { data: session }: any = useSession();
  const roles: string[] = session?.roles ?? [];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Profile
            </CardTitle>
            <CardDescription>Your account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={session?.user?.email || ""} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>User ID</Label>
              <Input value={session?.user?.id || ""} readOnly className="font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions
            </CardTitle>
            <CardDescription>Your assigned roles and access levels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Active Roles</Label>
              <div className="flex flex-wrap gap-2">
                {roles.length > 0 ? roles.map(role => (
                  <span key={role} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                    {role}
                  </span>
                )) : (
                  <span className="text-muted-foreground italic">No roles assigned</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Developer Info
            </CardTitle>
            <CardDescription>Environment configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Tenant Override</Label>
              <div className="p-2 border rounded-md bg-muted font-mono text-sm">
                {process.env.NEXT_PUBLIC_DEV_TENANT || "(not set)"}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Community Code (Share this with Residents)</Label>
              <div className="p-2 border rounded-md bg-muted font-mono text-sm flex justify-between items-center">
                <span>{session?.tenant_slug || "N/A"}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(session?.tenant_slug || "")}>Copy</Button>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>API Base URL</Label>
              <div className="p-2 border rounded-md bg-muted font-mono text-sm">
                {process.env.NEXT_PUBLIC_API_BASE || "/api/v1"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
