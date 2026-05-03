"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateCompanyForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/company/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        setMsg(await res.text());
      } else {
        setMsg("Company created");
        setName("");
      }
    } catch (err) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="text-sm">Company name</label>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      {msg ? <div className="text-sm">{msg}</div> : null}
      <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
    </form>
  );
}
