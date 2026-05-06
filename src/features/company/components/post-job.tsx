"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const PostJob = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/company/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          company,
          description,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText || "Failed to post job");
        return;
      }

      alert("Job successfully posted");
      router.refresh();
    } catch (error) {
      alert("Network error while posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold">
        Post New Job
      </h2>

      <input
        placeholder="Job Title"
        className="border p-2 w-full"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Company Name"
        className="border p-2 w-full"
        onChange={(e) => setCompany(e.target.value)}
      />

      <textarea
        placeholder="Job Description"
        className="border p-2 w-full"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handlePost}
        disabled={loading}
        className="bg-black text-white px-4 py-2"
      >
        {loading ? "Posting..." : "Post Job"}
      </button>
    </div>
  );
};