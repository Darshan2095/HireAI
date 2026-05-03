"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PostJobForm({ company }: { company: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/company/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, company }),
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage(text || "Error");
      } else {
        setMessage("Job posted");
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <label className="text-sm">Title</label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />

      <label className="text-sm">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="h-32 w-full rounded-lg border px-3 py-2"
      />

      {message ? <div className="text-sm">{message}</div> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? "Posting..." : "Post job"}</Button>
      </div>
    </form>
  );
}
