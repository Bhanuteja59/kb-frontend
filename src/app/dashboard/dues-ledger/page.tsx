"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiGet, apiPostJson } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DollarSign, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chargeSchema = z.object({
  unit_id: z.string().uuid(),
  amount_cents: z.number().int().positive(),
  description: z.string().min(2),
});

const paymentSchema = z.object({
  unit_id: z.string().uuid(),
  amount_cents: z.number().int().positive(),
  method: z.string().min(1),
  reference: z.string().optional().nullable(),
});

export default function LedgerPage() {
  const { data: session }: any = useSession();
  const roles: string[] = session?.roles ?? [];
  const canWrite = roles.includes("ADMIN");

  const qc = useQueryClient();
  const units = useQuery({ queryKey: ["units"], queryFn: () => apiGet<any[]>("/units") });

  const [unitId, setUnitId] = useState<string>("");
  const [chargeAmt, setChargeAmt] = useState<number>(25000); // Default $250.00
  const [chargeDesc, setChargeDesc] = useState<string>("Monthly dues");
  const [payAmt, setPayAmt] = useState<number>(25000);
  const [payMethod, setPayMethod] = useState<string>("MANUAL");
  const [payRef, setPayRef] = useState<string>("");

  const balance = useQuery({
    queryKey: ["balance", unitId],
    queryFn: () => apiGet<any>(unitId ? `/ledger/balance?unit_id=${encodeURIComponent(unitId)}` : "/ledger/balance"),
    enabled: roles.includes("USER") || !!unitId,
  });

  const createCharge = useMutation({
    mutationFn: (body: any) => apiPostJson<any>("/ledger/charges", body),
    onSuccess: async () => {
      setChargeDesc("Monthly dues");
      await qc.invalidateQueries({ queryKey: ["balance"] });
    },
  });

  const createPayment = useMutation({
    mutationFn: (body: any) => apiPostJson<any>("/ledger/payments", body),
    onSuccess: async () => {
      setPayRef("");
      await qc.invalidateQueries({ queryKey: ["balance"] });
    },
  });

  const unitOptions = useMemo(() => units.data ?? [], [units.data]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Finances & Ledger</h2>
      </div>

      {canWrite && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Select Unit</CardTitle>
              <CardDescription>View ledger and post transactions for a specific unit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={unitId} onValueChange={setUnitId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>{u.unit_number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Balance Card */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.isLoading ? "..." :
                (balance.data?.balance_cents ? `$${(balance.data.balance_cents / 100).toFixed(2)}` : "$0.00")
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {unitId ? `For unit ${unitOptions.find((u: any) => u.id === unitId)?.unit_number}` : "Your unit"}
            </p>
          </CardContent>
        </Card>
      </div>

      {canWrite && unitId && (
        <Tabs defaultValue="charge" className="space-y-4 mt-6">
          <TabsList>
            <TabsTrigger value="charge">Post Charge</TabsTrigger>
            <TabsTrigger value="payment">Record Payment</TabsTrigger>
          </TabsList>
          <TabsContent value="charge">
            <Card>
              <CardHeader>
                <CardTitle>Post New Charge</CardTitle>
                <CardDescription>Add a fee or dues to the unit ledger.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input value={chargeDesc} onChange={(e) => setChargeDesc(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Amount (Cents)</label>
                  <Input type="number" value={chargeAmt} onChange={(e) => setChargeAmt(Number(e.target.value))} />
                  <p className="text-xs text-muted-foreground">${(chargeAmt / 100).toFixed(2)}</p>
                </div>
                <Button
                  onClick={() => {
                    const parsed = chargeSchema.safeParse({ unit_id: unitId, amount_cents: chargeAmt, description: chargeDesc });
                    if (!parsed.success) return;
                    createCharge.mutate(parsed.data);
                  }}
                  disabled={createCharge.isPending}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  {createCharge.isPending ? "Posting..." : "Post Charge"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Record Payment</CardTitle>
                <CardDescription>Log a payment received from the resident.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Method</label>
                    <Select value={payMethod} onValueChange={setPayMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANUAL">Manual/Other</SelectItem>
                        <SelectItem value="CHECK">Check</SelectItem>
                        <SelectItem value="CASH">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Reference (Check #)</label>
                    <Input value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Amount (Cents)</label>
                  <Input type="number" value={payAmt} onChange={(e) => setPayAmt(Number(e.target.value))} />
                  <p className="text-xs text-muted-foreground">${(payAmt / 100).toFixed(2)}</p>
                </div>
                <Button
                  onClick={() => {
                    const parsed = paymentSchema.safeParse({ unit_id: unitId, amount_cents: payAmt, method: payMethod, reference: payRef || null });
                    if (!parsed.success) return;
                    createPayment.mutate(parsed.data);
                  }}
                  disabled={createPayment.isPending}
                >
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  {createPayment.isPending ? "Recording..." : "Record Payment"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
