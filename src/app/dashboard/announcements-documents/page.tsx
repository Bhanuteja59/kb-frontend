"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiGet, apiPostJson, apiPutJson, apiDelete, apiPostMultipart } from "@/lib/api";
import JobStatus from "@/components/JobStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, FileText, Megaphone, Edit2, Trash2 } from "lucide-react";

const annSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(5),
  audience: z.string().min(1),
  publish: z.boolean(),
});

export default function AnnouncementsDocumentsPage() {
  const { data: session }: any = useSession();
  const roles: string[] = session?.roles ?? [];
  const isAdmin = roles.includes("ADMIN");

  const qc = useQueryClient();
  const [lastJobId, setLastJobId] = useState<string | null>(null);

  // Queries
  const announcements = useQuery({ queryKey: ["announcements"], queryFn: () => apiGet<any[]>("/announcements") });
  const documents = useQuery({ queryKey: ["documents"], queryFn: () => apiGet<any[]>("/documents") });

  // Create/Edit State
  const [aTitle, setATitle] = useState("");
  const [aBody, setABody] = useState("");
  const [audience, setAudience] = useState("ALL");

  const [editingAnn, setEditingAnn] = useState<any>(null);
  const [deletingAnn, setDeletingAnn] = useState<any>(null);
  const [deletingDoc, setDeletingDoc] = useState<any>(null);

  // Edit Form
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editAudience, setEditAudience] = useState("ALL");


  // Mutations (Announcements)
  const createAnnouncement = useMutation({
    mutationFn: (body: any) => apiPostJson<any>("/announcements", body),
    onSuccess: async () => {
      setATitle(""); setABody(""); setAudience("ALL");
      await qc.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: (vars: { id: string, body: any }) => apiPutJson<any>(`/announcements/${vars.id}`, vars.body),
    onSuccess: async () => {
      setEditingAnn(null);
      await qc.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: (id: string) => apiDelete<any>(`/announcements/${id}`),
    onSuccess: async () => {
      setDeletingAnn(null);
      await qc.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  // Mutations (Documents)
  const uploadDoc = useMutation({
    mutationFn: (form: FormData) => apiPostMultipart<any>("/documents", form),
    onSuccess: async (resp) => {
      setLastJobId(resp?.job_id ?? null);
      await qc.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const deleteDoc = useMutation({
    mutationFn: (id: string) => apiDelete<any>(`/documents/${id}`),
    onSuccess: async () => {
      setDeletingDoc(null);
      await qc.invalidateQueries({ queryKey: ["documents"] });
    },
  });


  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Community Updates</h2>
      </div>

      <Tabs defaultValue="announcements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Create Announcement</CardTitle>
                <CardDescription>Share updates with residents or the board.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Input placeholder="Title" value={aTitle} onChange={(e) => setATitle(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Textarea placeholder="Content" value={aBody} onChange={(e) => setABody(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Residents</SelectItem>
                      <SelectItem value="RESIDENTS">Residents Only</SelectItem>
                      <SelectItem value="BOARD">Board Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => {
                      const parsed = annSchema.safeParse({ title: aTitle, body: aBody, audience, publish: true });
                      if (!parsed.success) return;
                      createAnnouncement.mutate(parsed.data);
                    }}
                    disabled={createAnnouncement.isPending}
                  >
                    {createAnnouncement.isPending ? "Publishing..." : "Publish Announcement"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(announcements.data?.length === 0) ? (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-dashed">
                <Megaphone className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Announcements</h3>
                <p className="text-sm text-muted-foreground mt-1">Check back later for community updates.</p>
              </div>
            ) : (
              (announcements.data ?? []).map((a: any) => (
                <Card key={a.id} className="relative group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{a.title}</CardTitle>
                      <Badge variant={a.audience === 'BOARD' ? 'destructive' : 'secondary'}>{a.audience}</Badge>
                    </div>
                    <CardDescription>{new Date(a.published_at || a.created_at).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.body}</p>
                  </CardContent>
                  {isAdmin && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-background" onClick={() => {
                        setEditTitle(a.title);
                        setEditBody(a.body);
                        setEditAudience(a.audience);
                        setEditingAnn(a);
                      }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => setDeletingAnn(a)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              )))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>Upload PDFs or text files. They will be searchable.</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formEl = e.currentTarget;
                    const formData = new FormData(formEl);
                    uploadDoc.mutate(formData);
                    formEl.reset();
                  }}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="title" placeholder="Document Title" required />
                    <Select name="acl" defaultValue="RESIDENT_VISIBLE">
                      <SelectTrigger>
                        <SelectValue placeholder="Visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RESIDENT_VISIBLE">Visible to Residents</SelectItem>
                        <SelectItem value="BOARD_ONLY">Board Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input type="file" name="file" required className="cursor-pointer" />
                    <Button type="submit" disabled={uploadDoc.isPending}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadDoc.isPending ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </form>
                {uploadDoc.error && (
                  <p className="text-sm text-destructive mt-2">{(uploadDoc.error as Error).message}</p>
                )}
                {lastJobId && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <JobStatus jobId={lastJobId} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {(documents.data?.length === 0) ? (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-dashed">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Documents</h3>
                <p className="text-sm text-muted-foreground mt-1">Repository is empty.</p>
              </div>
            ) : (
              (documents.data ?? []).map((d: any) => (
                <div key={d.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{d.title}</p>
                      <p className="text-sm text-muted-foreground">{d.filename}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{d.acl}</Badge>
                    <Button variant="ghost" size="sm">Download</Button>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setDeletingDoc(d)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Announcement Dialog */}
      <Dialog open={!!editingAnn} onOpenChange={(open) => !open && setEditingAnn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update content or visibility</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Textarea placeholder="Content" value={editBody} onChange={(e) => setEditBody(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Select value={editAudience} onValueChange={setEditAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Residents</SelectItem>
                  <SelectItem value="RESIDENTS">Residents Only</SelectItem>
                  <SelectItem value="BOARD">Board Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAnn(null)}>Cancel</Button>
            <Button disabled={updateAnnouncement.isPending} onClick={() => {
              if (editingAnn) {
                updateAnnouncement.mutate({
                  id: editingAnn.id,
                  body: { title: editTitle, body: editBody, audience: editAudience, publish: true }
                });
              }
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Announcement Dialog */}
      <Dialog open={!!deletingAnn} onOpenChange={(open) => !open && setDeletingAnn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement?</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingAnn(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (deletingAnn) deleteAnnouncement.mutate(deletingAnn.id);
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Document Dialog */}
      <Dialog open={!!deletingDoc} onOpenChange={(open) => !open && setDeletingDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document?</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingDoc(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (deletingDoc) deleteDoc.mutate(deletingDoc.id);
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
