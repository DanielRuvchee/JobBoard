import { auth } from "@/app/utils/auth";
import { requireUser } from "@/app/utils/requireUser";
import { redirect } from "next/navigation";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();



// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      try {
        const session = await auth();
        
        if (!session?.user) {
          throw new UploadThingError("Unauthorized - please log in");
        }
        
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: session.user.id };
      } catch (error) {
        console.error("UploadThing middleware error:", error);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

    resumeUploader: f({
      pdf: {
        maxFileSize: "5MB",
        maxFileCount: 1,
      },
    })
      .middleware(async () => {
        try {
          const session = await auth();
          
          if (!session?.user) {
            throw new UploadThingError("Unauthorized - please log in");
          }
          
          return { userId: session.user.id };
        } catch (error) {
          console.error("Resume upload middleware error:", error);
          throw new UploadThingError("Authentication failed");
        }
      })
      .onUploadComplete(async ({ metadata, file }) => {
        console.log("Resume upload complete for userId:", metadata.userId);
        console.log("Resume file url:", file.url);
        
        return { uploadedBy: metadata.userId, url: file.url };
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
