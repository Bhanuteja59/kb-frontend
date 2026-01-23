"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiGet, apiPostJson } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, CheckCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const woSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
});

export default function WorkOrdersPage() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const list = useQuery({
    queryKey: ["workOrders"],
    queryFn: () => apiGet<any[]>("/work-orders"),
  });

  const create = useMutation({
    mutationFn: (body: any) => apiPostJson<any>("/work-orders", body),
    onSuccess: async () => {
      setTitle("");
      setDescription("");
      setIsDialogOpen(false);
      await qc.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="secondary"><Wrench className="mr-1 h-3 w-3" /> In Progress</Badge>;
      default:
        return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Work Orders</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Work Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Work Order</DialogTitle>
              <DialogDescription>
                Submit a maintenance request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  const parsed = woSchema.safeParse({ title, description });
                  if (!parsed.success) return;
                  create.mutate(parsed.data);
                }}
                disabled={create.isPending}
              >
                {create.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.isLoading ? (
          <p className="text-muted-foreground">Loading tickets...</p>
        ) : (
          (list.data?.length === 0) ? (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-dashed">
              <Wrench className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Work Orders</h3>
              <p className="text-sm text-muted-foreground mt-1">Maintenance queue is empty.</p>
            </div>
          ) : (
            (list.data ?? []).map((w: any) => (
              <Card key={w.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{w.title}</CardTitle>
                    {getStatusBadge(w.status)}
                  </div>
                  <CardDescription>ID: {w.id.substring(0, 8)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{w.description}</p>
                  {w.user_name && <p className="text-xs font-medium mt-2">Requested by {w.user_name} • Unit {w.unit_number}</p>}
                </CardContent>
              </Card>
            )))
        )}
      </div>
    </div>
  );
}
