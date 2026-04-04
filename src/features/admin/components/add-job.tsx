"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Building2, 
  AlignLeft, 
  Link2, 
  PlusCircle, 
  Loader2,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const AddJob = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    resumeId: "",
  });

  const handleSubmit = async () => {
    if (!form.title || !form.company) return alert("Please fill in required fields");
    
    setLoading(true);
    try {
      await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      router.refresh();
      // Optional: Clear form
      setForm({ title: "", company: "", description: "", resumeId: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border/60 rounded-[24px] overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Post New Opportunity</h2>
              <p className="text-xs text-muted-foreground">Add a job listing to the matching engine.</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Job Title
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="title"
                  placeholder="e.g. Senior Frontend Engineer"
                  className="pl-10 rounded-xl h-11 border-border/60 focus-visible:ring-primary/20"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Company Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="company"
                  placeholder="e.g. Acme Corp"
                  className="pl-10 rounded-xl h-11 border-border/60 focus-visible:ring-primary/20"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="desc" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Job Description
            </Label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
              <Textarea
                id="desc"
                placeholder="Describe the role, requirements, and tech stack..."
                className="pl-10 rounded-xl min-h-[120px] pt-2.5 border-border/60 focus-visible:ring-primary/20"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {/* Resume ID Link */}
          <div className="space-y-2">
            <Label htmlFor="resumeId" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Target Profile ID (Optional)
            </Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
              <Input
                id="resumeId"
                placeholder="Link to a specific resume reference"
                className="pl-10 rounded-xl h-11 border-border/60 focus-visible:ring-primary/20"
                value={form.resumeId}
                onChange={(e) => setForm({ ...form, resumeId: e.target.value })}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading || submitted}
              className={cn(
                "w-full h-12 rounded-xl font-bold transition-all duration-300",
                submitted ? "bg-emerald-500 hover:bg-emerald-500" : "bg-primary hover:shadow-lg hover:shadow-primary/20"
              )}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : submitted ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" /> Job Posted Successfully
                </div>
              ) : (
                "Publish Job Listing"
              )}
            </Button>
          </div>

        </div>
      </div>
      
      <p className="text-center text-[11px] text-muted-foreground mt-6 uppercase tracking-widest font-medium opacity-50">
        Admin Portal &bull; Secure Submission
      </p>
    </div>
  );
};