"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { apiGet, apiPostJson, apiPutJson } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Shield, Code, Server, Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function SettingsPage() {
  const { data: session, update }: any = useSession();
  const roles: string[] = session?.roles ?? [];

  const [email, setEmail] = useState(session?.user?.email || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync state with session if needed (on initial load)
  if (email === "" && session?.user?.email) {
    setEmail(session.user.email);
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = session?.user?.id;
      if (!userId) return;

      await apiPutJson(`/users/${userId}`, { email });

      // Notify success
      alert("Email updated successfully. Please log in again if session expires."); // Simple alert for now

      setIsEditing(false);
      // Force session update
      await update({
        ...session,
        user: { ...session?.user, email }
      });

    } catch (e) {
      console.error(e);
      alert("Failed to update email. It might be already taken.");
    } finally {
      setLoading(false);
    }
  };


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
              <div className="flex gap-2">
                <Input
                  value={isEditing ? email : session?.user?.email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!isEditing}
                />
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={loading}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => { setEmail(session?.user?.email); setIsEditing(true); }}>
                    Edit
                  </Button>
                )}
              </div>
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
              <Server className="h-5 w-5" />
              Community Info
            </CardTitle>
            <CardDescription>Share this code with your residents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Community Code</Label>
              <div className="p-2 border rounded-md bg-muted font-mono text-sm flex justify-between items-center">
                <span>{session?.tenant_slug || "N/A"}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(session?.tenant_slug || "")}>Copy</Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">This code is required for residents to register.</p>
          </CardContent>
        </Card>

        <ChangePasswordCard />
      </div>
    </div>
  );
}

function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await apiPutJson("/users/me/password", {
        current_password: currentPassword,
        new_password: newPassword
      });
      toast({ title: "Success", description: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      // Safe error parsing
      let msg = "Failed to update password";
      if (err.message) msg = err.message;
      // The user provided example shows error structure might be nested or just message.
      // Our api wrapper usually throws Error(message).
      // If the backend sends { error: { code, message } }, our wrapper usually extracts it.
      // Let's rely on err.message which should be populated by the API wrapper.

      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>Update your login credentials.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label>Current Password</Label>
          <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>New Password</Label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Confirm New Password</Label>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <Button onClick={handleChangePassword} disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Update Password
        </Button>
      </CardContent>
    </Card>
  );
}
