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
      const session = await auth();

      if (!session?.user?.email) {
        throw new Error("Unauthorized");
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
        throw new Error("User not found");
      }

      return {
        userId: user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Only save resume metadata
        const createdResume = await prisma.resume.create({
          data: {
            title: file.name,
            fileUrl: file.url,
            userId: metadata.userId,
          },
        });

        // Return resume ID for further processing
        return {
          resumeId: createdResume.id,
          fileUrl: file.url,
        };

      } catch (error) {
        console.error("Resume upload save failed:", error);

        return {
          resumeId: null,
          fileUrl: null,
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;