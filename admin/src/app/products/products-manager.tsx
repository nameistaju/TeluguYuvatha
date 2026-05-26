"use client";

import type React from "react";
import type { Product } from "@telugu-yuvatha/shared";
import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { api } from "@/lib/api";

type Option = { id: string; name: string };

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  categoryId: "",
  collectionId: "",
  price: "999",
  comparePrice: "",
  sizes: "S, M, L, XL",
  colors: "Black",
  stock: "0",
  sku: "",
  tags: "",
  material: "Cotton",
  imageUrl: "",
  featured: false,
  comingSoon: false
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProductsManager({
  initialProducts,
  categories,
  collections
}: {
  initialProducts: Product[];
  categories: Option[];
  collections: Option[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({ ...emptyForm, categoryId: categories[0]?.id ?? "", collectionId: collections[0]?.id ?? "" });
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const canSubmit = useMemo(() => form.name && form.categoryId && form.sku && Number(form.price) > 0, [form]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !current.slug ? { slug: slugify(String(value)) } : {})
    }));
  }

  async function createProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving product...");
    try {
      const token = localStorage.getItem("ty_admin_token");
      if (!token) throw new Error("Please sign in as admin first.");
      const product = await api.post<Product>(
        "/products",
        {
          name: form.name.trim(),
          slug: form.slug || slugify(form.name),
          description: form.description.trim(),
          categoryId: form.categoryId,
          collectionId: form.collectionId || undefined,
          price: Number(form.price),
          comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
          sizes: splitList(form.sizes),
          colors: splitList(form.colors),
          stock: Number(form.stock),
          sku: form.sku.trim(),
          tags: splitList(form.tags),
          material: form.material.trim(),
          featured: form.featured,
          comingSoon: form.comingSoon,
          images: form.imageUrl
            ? [{ id: `img-${Date.now()}`, url: form.imageUrl.trim(), alt: form.name.trim(), position: 1 }]
            : [],
          seo: { title: `${form.name.trim()} | Telugu Yuvatha`, description: form.description.trim() }
        },
        { token }
      );
      setProducts((current) => [product, ...current]);
      setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "", collectionId: collections[0]?.id ?? "" });
      setIsOpen(false);
      setMessage("Product added successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not add product.");
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="text-sm text-[var(--muted)]">Catalogue, pricing, inventory, and drop status.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)]"
        >
          <Plus size={16} aria-hidden />
          New product
        </button>
      </div>

      {message && <p className="mb-4 rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm">{message}</p>}

      {isOpen && (
        <section className="surface mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add product</h2>
            <button onClick={() => setIsOpen(false)} className="rounded-md border border-[var(--border)] p-2" aria-label="Close product form">
              <X size={17} aria-hidden />
            </button>
          </div>

          <form onSubmit={createProduct} className="grid gap-4 md:grid-cols-2">
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Product name" value={form.name} onChange={(event) => update("name", event.target.value)} required />
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Slug" value={form.slug} onChange={(event) => update("slug", event.target.value)} />
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="SKU" value={form.sku} onChange={(event) => update("sku", event.target.value)} required />
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Image URL" value={form.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} />
            <select className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)} required>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <select className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" value={form.collectionId} onChange={(event) => update("collectionId", event.target.value)}>
              <option value="">No collection</option>
              {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
            </select>
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Price" type="number" value={form.price} onChange={(event) => update("price", event.target.value)} required />
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Compare price" type="number" value={form.comparePrice} onChange={(event) => update("comparePrice", event.target.value)} />
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Sizes: S, M, L" value={form.sizes} onChange={(event) => update("sizes", event.target.value)} />
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Colors: Black, Olive" value={form.colors} onChange={(event) => update("colors", event.target.value)} />
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Stock" type="number" value={form.stock} onChange={(event) => update("stock", event.target.value)} />
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Material" value={form.material} onChange={(event) => update("material", event.target.value)} />
            <input className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2 md:col-span-2" placeholder="Tags: hoodie, black, drop" value={form.tags} onChange={(event) => update("tags", event.target.value)} />
            <textarea className="min-h-28 rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(event) => update("description", event.target.value)} required />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.comingSoon} onChange={(event) => update("comingSoon", event.target.checked)} /> Coming soon</label>
            <button disabled={!canSubmit} className="rounded-md bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--accent-ink)] disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2">
              Save product
            </button>
          </form>
        </section>
      )}

      <DataTable
        rows={products}
        columns={[
          { key: "name", label: "Product" },
          { key: "sku", label: "SKU" },
          { key: "price", label: "Price", render: (row) => `INR ${row.price}` },
          { key: "stock", label: "Stock" },
          { key: "featured", label: "Featured", render: (row) => (row.featured ? "Yes" : "No") },
          { key: "comingSoon", label: "Coming soon", render: (row) => (row.comingSoon ? "Yes" : "No") }
        ]}
      />
    </>
  );
}
