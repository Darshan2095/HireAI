"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type JobRow = { id: string; title: string; description: string };

export default function JobList({
  initialJobs,
  company,
}: {
  initialJobs: JobRow[];
  company: string;
}) {
  const [jobs, setJobs] = useState(initialJobs || []);
  const [loading, setLoading] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("Delete this job?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/company/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs((j) => j.filter((x) => x.id !== id));
      } else {
        alert(await res.text());
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      {jobs.map((job) => (
        <div key={job.id} className="rounded-xl border p-4 flex justify-between">
          <div>
            <div className="font-semibold">{job.title}</div>
            <div className="text-sm text-muted-foreground">{job.description}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(window.location.origin + `/company/${encodeURIComponent(company)}/jobs/${job.id}`)}>Share</Button>
            <Button variant="destructive" onClick={() => handleDelete(job.id)} disabled={loading}>Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
