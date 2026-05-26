"use client";

import type React from "react";
import type { SiteSetting } from "@telugu-yuvatha/shared";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { api } from "@/lib/api";

export function SettingsManager({ initialRows }: { initialRows: SiteSetting[] }) {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ key: "", value: "{}" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const token = localStorage.getItem("ty_admin_token");
      if (!token) throw new Error("Please login as admin first.");
      const row = await api.post<SiteSetting>("/settings", { key: form.key, value: JSON.parse(form.value) }, { token });
      setRows((current) => [row, ...current.filter((item) => item.key !== row.key)]);
      setForm({ key: "", value: "{}" });
      setOpen(false);
      setMessage("Setting saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save setting. Check JSON syntax.");
    }
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="text-sm text-[var(--muted)]">Brand, commerce, and storefront configuration.</p>
        </div>
        <button onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)]">
          <Plus size={16} /> New setting
        </button>
      </div>
      {message && <p className="mb-4 rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm">{message}</p>}
      {open && (
        <form onSubmit={submit} className="surface mb-6 grid gap-3 p-5">
          <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} required />
          <textarea className="min-h-32 rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2 font-mono text-sm" placeholder='{"value": true}' value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
          <button className="rounded-md bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--accent-ink)]">Save setting</button>
        </form>
      )}
      <DataTable rows={rows} columns={[{ key: "key", label: "Key" }, { key: "value", label: "Value", render: (row) => JSON.stringify(row.value) }]} />
    </>
  );
}
