"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  FileText,
  AlertTriangle,
  ClipboardList,
  Megaphone,
  Wrench
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const stats = useQuery({
    queryKey: ["stats"],
    queryFn: () => apiGet<any>("/stats"),
  });

  const recentAnnouncements = useQuery({
    queryKey: ["announcements", "recent"],
    queryFn: () => apiGet<any[]>("/announcements?limit=5"),
  });

  const recentWorkOrders = useQuery({
    queryKey: ["work-orders", "recent"],
    queryFn: () => apiGet<any[]>("/work-orders?limit=5"),
  });

  const s = stats.data || {};

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.isLoading ? "..." : s.residents_count ?? 0}</div>
            <p className="text-xs text-muted-foreground">Registered in community</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.isLoading ? "..." : s.open_work_orders ?? 0}</div>
            <p className="text-xs text-muted-foreground">Pending resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.isLoading ? "..." : s.open_violations ?? 0}</div>
            <p className="text-xs text-muted-foreground">Active issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending ARC Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.isLoading ? "..." : s.pending_arc ?? 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Recent Work Orders (Replacing Chart) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Work Orders</CardTitle>
            <CardDescription>Latest maintenance requests.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentWorkOrders.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading activity...</p>
            ) : (recentWorkOrders.data?.length === 0) ? (
              <p className="text-sm text-muted-foreground">No recent work orders.</p>
            ) : (
              <div className="space-y-4">
                {(recentWorkOrders.data ?? []).map((wo: any) => (
                  <div key={wo.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{wo.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {wo.unit_number ? `Unit ${wo.unit_number}` : "Common Area"} • {new Date(wo.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={wo.status === "COMPLETED" ? "secondary" : "default"}>{wo.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Community Updates</CardTitle>
            <CardDescription>
              Latest announcements from the board.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAnnouncements.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading updates...</p>
            ) : (recentAnnouncements.data?.length === 0) ? (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Megaphone className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No recent announcements.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(recentAnnouncements.data ?? []).map((a: any) => (
                  <div key={a.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{a.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{a.body}</p>
                      <p className="text-xs text-muted-foreground pt-1">{new Date(a.published_at || a.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
