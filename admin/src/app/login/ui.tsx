"use client";

import { LogIn } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { api } from "@/lib/api";

export function LoginForm() {
  const [email, setEmail] = useState("admin@teluguyuvatha.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Signing in...");
    try {
      const result = await api.post<{ token: string; user: { role: string } }>("/auth/login", { email, password });
      if (result.user.role !== "admin") throw new Error("Only admin accounts can access this dashboard");
      localStorage.setItem("ty_admin_token", result.token);
      setMessage("Signed in. Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    }
  }

  return (
    <section className="surface w-full max-w-md p-6">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Create an admin with `/api/auth/register`, then sign in here.</p>
      <form onSubmit={login} className="mt-5 grid gap-3">
        <input suppressHydrationWarning value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Email" />
        <input suppressHydrationWarning value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-md border border-[var(--border)] bg-[#101217] px-3 py-2" placeholder="Password" type="password" />
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 font-semibold text-[var(--accent-ink)]">
          <LogIn size={17} aria-hidden />
          Sign in
        </button>
      </form>
      {message && <p className="mt-4 rounded-md bg-[#101217] p-3 text-sm text-[#e6e9ef]">{message}</p>}
    </section>
  );
}
