"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export const UploadResume = () => {
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Dynamic messages to keep the user engaged during the AI "Wait"
  const getWaitingMessage = () => {
    if (uploadStatus === "uploading") return "Securing your file...";
    if (uploadStatus === "processing") return "AI is analyzing your impact...";
    return "Ready to scan";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <UploadDropzone<OurFileRouter, "resumeUploader">
        endpoint="resumeUploader"
        config={{
          mode: "auto",
        }}
        content={{
          label: "Drag & drop your PDF resume",
          allowedContent: "PDF (Max 4MB)",
        }}
        appearance={{
          container: cn(
            "relative flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 transition-all duration-300 bg-card/50",
            uploadStatus === "idle" && "border-border hover:border-primary/50 hover:bg-primary/[0.02]",
            uploadStatus === "uploading" && "border-primary border-solid animate-pulse",
            uploadStatus === "success" && "border-green-500 bg-green-50/10"
          ),
          label: "text-lg font-semibold text-foreground mt-4",
          allowedContent: "text-sm text-muted-foreground mt-1",
        }}
        onUploadBegin={() => {
          setUploadStatus("uploading");
          setErrorMessage("");
          console.log("[Upload] Upload started...");
        }}
        onClientUploadComplete={async (res) => {
          console.log("[Upload] Upload complete:", res);
          setUploadStatus("processing");
          // Simulate a tiny delay for "AI processing" feel
          setTimeout(() => {
            setUploadStatus("success");
            router.refresh();
          }, 1500);
        }}
        onUploadError={(error) => {
          console.error("[Upload] Error occurred:", error);
          setUploadStatus("error");
          setErrorMessage(error.message || "Upload failed. Please try again.");
          
          // Reset after 5 seconds
          setTimeout(() => {
            setUploadStatus("idle");
            setErrorMessage("");
          }, 5000);
        }}
      />

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-green-600" /> Secure upload
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" /> AI-ready parsing
        </span>

        {(uploadStatus === "uploading" || uploadStatus === "processing") && (
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> {getWaitingMessage()}
          </span>
        )}

        {uploadStatus === "success" && (
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Upload complete
          </span>
        )}
        </div>

        {uploadStatus === "error" && errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Upload failed</p>
              <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};