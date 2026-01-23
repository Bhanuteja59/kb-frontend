// frontend/src/lib/api.ts
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

// mocks removed
const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

function devTenantHeaders(): Record<string, string> {
  const t = process.env.NEXT_PUBLIC_DEV_TENANT;
  return t ? { "x-tenant-slug": t } : {};
}

async function handleAuthError(res: Response) {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      await signOut({ callbackUrl: "/login" });
    } else {
      redirect("/login");
    }
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const session: any = await getSession();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      authorization: `Bearer ${session?.user?.accessToken ?? ""}`,
      ...(session?.user?.tenantId ? { "x-tenant-id": session.user.tenantId } : devTenantHeaders()),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    await handleAuthError(res);
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function apiPostJson<T>(path: string, body: unknown): Promise<T> {
  const session: any = await getSession();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user?.accessToken ?? ""}`,
      ...(session?.user?.tenantId ? { "x-tenant-id": session.user.tenantId } : devTenantHeaders()),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    await handleAuthError(res);
    const txt = await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function apiPutJson<T>(path: string, body: unknown): Promise<T> {
  const session: any = await getSession();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user?.accessToken ?? ""}`,
      ...(session?.user?.tenantId ? { "x-tenant-id": session.user.tenantId } : devTenantHeaders()),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    await handleAuthError(res);
    const txt = await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function apiPatchJson<T>(path: string, body: unknown): Promise<T> {
  const session: any = await getSession();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user?.accessToken ?? ""}`,
      ...(session?.user?.tenantId ? { "x-tenant-id": session.user.tenantId } : devTenantHeaders()),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    await handleAuthError(res);
    const txt = await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function apiPostMultipart<T>(path: string, form: FormData): Promise<T> {
  const session: any = await getSession();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${session?.user?.accessToken ?? ""}`,
      ...(session?.user?.tenantId ? { "x-tenant-id": session.user.tenantId } : devTenantHeaders()),
      // NOTE: do not set content-type; browser sets boundary.
    },
    body: form,
  });
  if (!res.ok) {
    await handleAuthError(res);
    const txt = await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function apiDelete<T>(path: string): Promise<T> {
  const session: any = await getSession();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user?.accessToken ?? ""}`,
      ...(session?.user?.tenantId ? { "x-tenant-id": session.user.tenantId } : devTenantHeaders()),
    },
  });
  if (!res.ok) {
    await handleAuthError(res);
    const txt = await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${txt}`);
  }
  return res.json();
}

