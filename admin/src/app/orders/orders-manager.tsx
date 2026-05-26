"use client";

import type { Order, OrderStatus } from "@telugu-yuvatha/shared";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { api } from "@/lib/api";

const statuses: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

export function OrdersManager() {
  const [rows, setRows] = useState<Order[]>([]);
  const [message, setMessage] = useState("Login as admin to load orders.");

  async function loadOrders() {
    try {
      const token = localStorage.getItem("ty_admin_token");
      if (!token) throw new Error("Please login as admin first.");
      const orders = await api.get<Order[]>("/orders", { token });
      setRows(orders);
      setMessage(`Loaded ${orders.length} orders.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load orders.");
    }
  }

  async function updateStatus(order: Order, status: OrderStatus) {
    try {
      const token = localStorage.getItem("ty_admin_token");
      if (!token) throw new Error("Please login as admin first.");
      const updated = await api.put<Order>(`/orders/${order.id}/status`, { status }, { token });
      setRows((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setMessage(`Order ${order.id} updated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update order.");
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Orders</h1>
          <p className="text-sm text-[var(--muted)]">Track payment and shipping status.</p>
        </div>
        <button onClick={loadOrders} className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)]">
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>
      {message && <p className="mb-4 rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm">{message}</p>}
      <DataTable
        rows={rows}
        columns={[
          { key: "id", label: "Order" },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <select value={row.status} onChange={(event) => updateStatus(row, event.target.value as OrderStatus)} className="rounded-md border border-[var(--border)] bg-[#101217] px-2 py-1">
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            )
          },
          { key: "paymentStatus", label: "Payment" },
          { key: "total", label: "Total", render: (row) => `INR ${row.total}` },
          { key: "createdAt", label: "Created", render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") }
        ]}
      />
    </>
  );
}
