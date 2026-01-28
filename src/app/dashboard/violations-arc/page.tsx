"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiGet, apiPostJson, apiDelete } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Paintbrush, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const violationSchema = z.object({
  type: z.string().min(2),
  description: z.string().min(5),
});

const arcSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
});

export default function ViolationsArcPage() {
  const qc = useQueryClient();

  const violations = useQuery({ queryKey: ["violations"], queryFn: () => apiGet<any[]>("/violations") });
  const arcs = useQuery({ queryKey: ["arcRequests"], queryFn: () => apiGet<any[]>("/arc-requests") });

  const [vType, setVType] = useState("Noise");
  const [vDesc, setVDesc] = useState("");

  const [aTitle, setATitle] = useState("");
  const [aDesc, setADesc] = useState("");

  const createViolation = useMutation({
    mutationFn: (body: any) => apiPostJson<any>("/violations", body),
    onSuccess: async () => {
      setVDesc("");
      await qc.invalidateQueries({ queryKey: ["violations"] });
    },
  });

  const createArc = useMutation({
    mutationFn: (body: any) => apiPostJson<any>("/arc-requests", body),
    onSuccess: async () => {
      setATitle("");
      setADesc("");
      await qc.invalidateQueries({ queryKey: ["arcRequests"] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "APPROVED":
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="mr-1 h-3 w-3" /> {status}</Badge>;
      case "REJECTED":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> {status}</Badge>;
      default:
        return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> {status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Compliance & ARC</h2>
      </div>

      <Tabs defaultValue="violations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="arc">ARC Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="violations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Report a Violation</CardTitle>
                <CardDescription>Privacy is maintained. Your name is not shared with the violator.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Select value={vType} onValueChange={setVType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Violation Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Noise">Noise Complaint</SelectItem>
                      <SelectItem value="Parking">Parking Violation</SelectItem>
                      <SelectItem value="Trash">Trash/Debris</SelectItem>
                      <SelectItem value="Pet">Pet Violation</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Textarea placeholder="Description of the violation..." value={vDesc} onChange={(e) => setVDesc(e.target.value)} />
                </div>
                <Button
                  onClick={() => {
                    const parsed = violationSchema.safeParse({ type: vType, description: vDesc });
                    if (!parsed.success) return;
                    createViolation.mutate(parsed.data);
                  }}
                  disabled={createViolation.isPending}
                >
                  {createViolation.isPending ? "Submitting..." : "Submit Report"}
                </Button>
              </CardContent>
            </Card>
            <div className="col-span-4 grid gap-4">
              {violations.isLoading ? <p>Loading...</p> : (
                (violations.data?.length === 0) ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-dashed">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Violations Found</h3>
                    <p className="text-sm text-muted-foreground mt-1">Status quo is maintained. No issues reported.</p>
                  </div>
                ) : (
                  (violations.data ?? []).map((v: any) => (
                    <Card key={v.id}>
                      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <div className="font-semibold">{v.type}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(v.status)}
                          {/* Simple role check: if status is not RESOLVED, show Resolve button. 
                            Ideally check isAdmin, but backend enforces it. 
                            Frontend check relies on if the user CAN enable it. */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-destructive hover:text-destructive/90"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm("Start resolving this issue? This will remove it from the list.")) return;
                              try {
                                await apiDelete(`/violations/${v.id}`);
                                await qc.invalidateQueries({ queryKey: ["violations"] });
                              } catch (err: any) {
                                alert(`Failed to resolve: ${err.message}`);
                              }
                            }}
                          >
                            Resolve
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{v.description}</p>
                        {v.user_name && <p className="text-xs font-medium mt-2">Reported by {v.user_name} • Unit {v.unit_number}</p>}
                        <p className="text-xs text-muted-foreground mt-1">{new Date(v.created_at).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  )))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="arc" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>New ARC Request</CardTitle>
                <CardDescription>Submit architectural change requests for approval.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Input placeholder="Project Title (e.g. Fence Replacement)" value={aTitle} onChange={(e) => setATitle(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Textarea placeholder="Detailed description of the proposed changes..." value={aDesc} onChange={(e) => setADesc(e.target.value)} />
                </div>
                <Button
                  onClick={() => {
                    const parsed = arcSchema.safeParse({ title: aTitle, description: aDesc });
                    if (!parsed.success) return;
                    createArc.mutate(parsed.data);
                  }}
                  disabled={createArc.isPending}
                >
                  {createArc.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </CardContent>
            </Card>

            <div className="col-span-4 grid gap-4">
              {arcs.isLoading ? <p>Loading...</p> : (
                (arcs.data?.length === 0) ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-dashed">
                    <Paintbrush className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Requests</h3>
                    <p className="text-sm text-muted-foreground mt-1">No architectural changes pending.</p>
                  </div>
                ) : (
                  (arcs.data ?? []).map((a: any) => (
                    <Card key={a.id}>
                      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center space-x-2">
                          <Paintbrush className="h-4 w-4 text-primary" />
                          <div className="font-semibold">{a.title}</div>
                        </div>
                        {getStatusBadge(a.status)}
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                        {a.user_name && <p className="text-xs font-medium mt-2">Requested by {a.user_name} • Unit {a.unit_number}</p>}
                        <p className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  )))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div >
  );
}
