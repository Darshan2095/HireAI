"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const PostJob = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const handlePost = async () => {
    await fetch("/api/company/jobs", {
      method: "POST",
      body: JSON.stringify({
        title,
        company,
        description,
      }),
    });

    router.refresh();
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
        className="bg-black text-white px-4 py-2"
      >
        Post Job
      </button>
    </div>
  );
};