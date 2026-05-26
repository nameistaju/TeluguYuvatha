"use client";

import type React from "react";
import type { Collection } from "@telugu-yuvatha/shared";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { api } from "@/lib/api";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function CollectionsManager({ initialRows }: { initialRows: Collection[] }) {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", slug: "", description: "", sortOrder: "0", featured: false });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const token = localStorage.getItem("ty_admin_token");
      if (!token) throw new Error("Please login as admin first.");
      const row = await api.post<Collection>(
        "/collections",
        {
          name: form.name,
          slug: form.slug || slugify(form.name),
          description: form.description || undefined,
          sortOrder: Number(form.sortOrder),
          featured: form.featured
        },
        { token }
      );
      setRows((current) => [row, ...current]);
      setForm({ name: "", slug: "", description: "", sortOrder: "0", featured: false });
      setOpen(false);
      setMessage("Collection added.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save collection.");
    }
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Collections</h1>
          <p className="text-sm text-[var(--muted)]">Curate drops and editorial product groups.</p>
        </div>
        <button onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)]">
          <Plus size={16} /> New collection
        </button>
      </div>
      {message && <p className="mb-4 rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm">{message}</p>}
      {open && (
        <form onSubmit={submit} className="surface mb-6 grid gap-3 p-5 md:grid-cols-2">
          <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} required />
          <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Sort order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
          <textarea className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="rounded-md bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--accent-ink)] md:col-span-2">Save collection</button>
        </form>
      )}
      <DataTable rows={rows} columns={[{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }, { key: "featured", label: "Featured", render: (row) => (row.featured ? "Yes" : "No") }, { key: "sortOrder", label: "Sort" }]} />
    </>
  );
}
