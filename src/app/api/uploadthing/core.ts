import { createUploadthing, type FileRouter } from "uploadthing/next";
import { prisma } from "@/database/prisma";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({
    pdf: {
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => {
      try {
        const session = await auth();

        if (!session?.user?.email) {
          console.error("[UploadThing] No session found");
          throw new Error("Unauthorized - No active session");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
          select: {
            id: true,
          },
        });

        if (!user) {
          console.error("[UploadThing] User not found for email:", session.user.email);
          throw new Error("User not found in database");
        }

        console.log("[UploadThing] Middleware auth successful for user:", user.id);

        return {
          userId: user.id,
        };
      } catch (error) {
        console.error("[UploadThing] Middleware error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log("[UploadThing] Upload complete, saving resume:", { fileName: file.name, userId: metadata.userId });
        
        // Only save resume metadata
        const createdResume = await prisma.resume.create({
          data: {
            title: file.name,
            fileUrl: file.url,
            userId: metadata.userId,
          },
        });

        console.log("[UploadThing] Resume saved successfully:", createdResume.id);

        // Return resume ID for further processing
        return {
          resumeId: createdResume.id,
          fileUrl: file.url,
        };

      } catch (error) {
        console.error("[UploadThing] Resume upload save failed:", error);
        throw error; // Re-throw to surface the error to the client
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;