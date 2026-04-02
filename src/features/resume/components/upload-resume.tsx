"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export const UploadResume = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "success">("idle");

  // Dynamic messages to keep the user engaged during the AI "Wait"
  const getWaitingMessage = () => {
    if (uploadStatus === "uploading") return "Securing your file...";
    if (uploadStatus === "processing") return "AI is analyzing your impact...";
    return "Ready to scan";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <UploadDropzone<OurFileRouter>
        endpoint="resumeUploader"
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
          uploadButton: "hidden", // We hide the default button to use the dropzone as a single interactive unit
          label: "text-lg font-semibold text-foreground mt-4",
          allowedContent: "text-sm text-muted-foreground mt-1",
        }}
        onUploadBegin={() => {
          setIsUploading(true);
          setUploadStatus("uploading");
        }}
        onClientUploadComplete={async (res) => {
          setUploadStatus("processing");
          // Simulate a tiny delay for "AI processing" feel
          setTimeout(() => {
            setUploadStatus("success");
            setIsUploading(false);
            router.refresh();
          }, 1500);
        }}
        onUploadError={(error: Error) => {
          setUploadStatus("idle");
          setIsUploading(false);
        }}
        // Custom UI overlay inside the dropzone
        children={
          <div className="flex flex-col items-center text-center">
            {uploadStatus === "idle" && (
              <>
                <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Upload Resume</h3>
                <p className="text-muted-foreground mt-2 max-w-[280px]">
                  Drop your PDF here to get an instant <span className="text-primary font-semibold">AI Match Score</span>.
                </p>
                <div className="mt-6 flex items-center gap-4 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500" /> Secure</span>
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-blue-500" /> AI-Ready</span>
                </div>
              </>
            )}

            {(uploadStatus === "uploading" || uploadStatus === "processing") && (
              <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-300">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <Loader2 className="h-16 w-16 text-primary animate-spin absolute opacity-20" />
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">{getWaitingMessage()}</h3>
                  <p className="text-sm text-muted-foreground italic animate-pulse">
                    {uploadStatus === "processing" 
                      ? "Extracting skills and scanning for keywords..." 
                      : "Sending to our secure cloud..."}
                  </p>
                </div>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                <div className="p-4 rounded-full bg-green-500/10 mb-4 scale-110">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600 tracking-tight">Upload Complete!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Redirecting to your dashboard...
                </p>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};