"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiGet, apiPostJson, apiPutJson, apiDelete } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Home, Users, Search, Edit2, Trash2 } from "lucide-react";

const buildingSchema = z.object({ name: z.string().min(2) });
const unitSchema = z.object({ unit_number: z.string().min(1), building_id: z.string().optional().nullable() });

export default function ResidentsUnitsPage() {
  const { data: session }: any = useSession();
  const roles: string[] = session?.roles ?? [];
  const canWrite = roles.includes("ADMIN");

  const qc = useQueryClient();
  const buildings = useQuery({ queryKey: ["buildings"], queryFn: () => apiGet<any[]>("/units/buildings") });
  const units = useQuery({ queryKey: ["units"], queryFn: () => apiGet<any[]>("/units") });
  const users = useQuery({ queryKey: ["users"], queryFn: () => apiGet<any[]>("/users") });

  // Creation State
  const [bName, setBName] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [buildingId, setBuildingId] = useState<string>("");

  // Edit/Delete User State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingUser, setDeletingUser] = useState<any>(null);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editUnitId, setEditUnitId] = useState("none");

  const createBuilding = useMutation({
    mutationFn: (body: any) => apiPostJson<any>("/units/buildings", body),
    onSuccess: async () => {
      setBName("");
      await qc.invalidateQueries({ queryKey: ["buildings"] });
    },
  });

  const createUnit = useMutation({
    mutationFn: (body: any) => apiPostJson<any>("/units", body),
    onSuccess: async () => {
      setUnitNumber("");
      await qc.invalidateQueries({ queryKey: ["units"] });
    },
  });

  const updateUser = useMutation({
    mutationFn: (vars: { id: string, body: any }) => apiPutJson<any>(`/users/${vars.id}`, vars.body),
    onSuccess: async () => {
      setEditingUser(null);
      await qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => apiDelete<any>(`/users/${id}`),
    onSuccess: async () => {
      setDeletingUser(null);
      await qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const buildingOptions = useMemo(() => buildings.data ?? [], [buildings.data]);
  const unitOptions = useMemo(() => units.data ?? [], [units.data]);
  const residentList = useMemo(() => users.data ?? [], [users.data]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Residents & Directory</h2>
      </div>

      <Tabs defaultValue="residents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="residents">Residents</TabsTrigger>
          {canWrite && <TabsTrigger value="structure">Buildings & Units</TabsTrigger>}
        </TabsList>

        <TabsContent value="residents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> User Directory</CardTitle>
              <CardDescription>Manage residents and their unit assignments.</CardDescription>
            </CardHeader>
            <CardContent>
              {users.isLoading ? <p>Loading residents...</p> : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="border-b transition-colors hover:bg-muted/50 text-left">
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Unit</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Role</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Joined</th>
                        {canWrite && <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {residentList.length === 0 ? (
                        <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No residents found.</td></tr>
                      ) : residentList.map((u: any) => (
                        <tr key={u.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">{u.name}</td>
                          <td className="p-4 align-middle text-muted-foreground">{u.email}</td>
                          <td className="p-4 align-middle">
                            {u.unit_number ? (
                              <div className="flex flex-col">
                                <Badge variant="outline">{u.unit_number}</Badge>
                                {u.building_name && <span className="text-[10px] text-muted-foreground">{u.building_name}</span>}
                              </div>
                            ) : <span className="text-muted-foreground italic">Unassigned</span>}
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant={u.status === "active" ? "default" : u.status === "rejected" ? "destructive" : "secondary"} className={u.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""}>
                              {u.status || "active"}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                          </td>
                          <td className="p-4 align-middle">{new Date(u.created_at).toLocaleDateString()}</td>
                          {canWrite && (
                            <td className="p-4 align-middle text-right">
                              <div className="flex justify-end gap-2">
                                {u.status === "pending" && (
                                  <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                                    setEditName(u.name);
                                    setEditUnitId(u.unit_id || "none");
                                    setEditingUser(u);
                                    // Auto-open edit dialog which has save (and now approve logic implied or we add explicit approve)
                                    // Actually better to offer direct Approve or Edit-to-Approve. 
                                    // Creating a separate approve flow is better UX.
                                  }}>
                                    Review
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={() => {
                                  setEditName(u.name);
                                  setEditUnitId(u.unit_id || "none");
                                  setEditingUser(u);
                                }}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeletingUser(u)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {canWrite && (
          <TabsContent value="structure" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Add Building</CardTitle>
                  <CardDescription>Define a new building structure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Input placeholder="Building Name (e.g. Building A)" value={bName} onChange={(e) => setBName(e.target.value)} />
                  </div>
                  <Button
                    onClick={() => {
                      const parsed = buildingSchema.safeParse({ name: bName });
                      if (!parsed.success) return;
                      createBuilding.mutate(parsed.data);
                    }}
                    disabled={createBuilding.isPending}
                  >
                    {createBuilding.isPending ? "Creating..." : "Create Building"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Add Unit</CardTitle>
                  <CardDescription>Create a new unit within a building.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Unit Number (e.g. 101)" value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} />
                    <Select value={buildingId} onValueChange={setBuildingId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Building" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Building</SelectItem>
                        {buildingOptions.map((b: any) => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => {
                      const parsed = unitSchema.safeParse({ unit_number: unitNumber, building_id: buildingId === "none" ? null : buildingId });
                      if (!parsed.success) return;
                      createUnit.mutate(parsed.data);
                    }}
                    disabled={createUnit.isPending}
                  >
                    {createUnit.isPending ? "Creating..." : "Create Unit"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Buildings</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mt-2">
                    {(buildings.data ?? []).map((b: any) => (
                      <li key={b.id} className="flex items-center p-2 rounded-md hover:bg-muted/50">
                        <span className="font-medium">{b.name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Units</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mt-2 max-h-[300px] overflow-y-auto">
                    {(unitOptions).map((u: any) => (
                      <li key={u.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 border-b last:border-0 border-border/50">
                        <span className="font-medium">{u.unit_number}</span>
                        {u.building_id && <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">Bldg {buildingOptions.find((b: any) => b.id === u.building_id)?.name}</span>}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resident</DialogTitle>
            <DialogDescription>Update profile and unit assignment</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Name</Label>
              <Input className="col-span-3" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Unit</Label>
              <Select value={editUnitId} onValueChange={setEditUnitId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  <SelectItem value="none">-- Unassigned --</SelectItem>
                  {unitOptions.map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>Unit {u.unit_number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs text-muted-foreground">Or New</Label>
              <Input className="col-span-3" placeholder="Enter Unit Number manually (e.g. 101)"
                onChange={(e) => {
                  if (e.target.value) setEditUnitId("manual:" + e.target.value);
                  else setEditUnitId("none");
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select value={editingUser?.status || "active"} onValueChange={(val) => setEditingUser({ ...editingUser, status: val })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button disabled={updateUser.isPending} onClick={() => {
              if (editingUser) {
                let unitStr = "";
                if (editUnitId && editUnitId.startsWith("manual:")) {
                  unitStr = editUnitId.replace("manual:", "");
                } else {
                  const selectedUnit = unitOptions.find((u: any) => u.id === editUnitId);
                  unitStr = selectedUnit ? selectedUnit.unit_number : (editUnitId === "none" ? "" : undefined);
                }

                updateUser.mutate({
                  id: editingUser.id,
                  body: {
                    name: editName,
                    unit: unitStr,
                    status: editingUser.status
                  }
                });
              }
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Resident?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <b>{deletingUser?.name}</b>? They will lose access to this community.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>Cancel</Button>
            <Button variant="destructive" disabled={deleteUser.isPending} onClick={() => {
              if (deletingUser) {
                deleteUser.mutate(deletingUser.id);
              }
            }}>Remove Resident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
