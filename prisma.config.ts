import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

const prismaUrl = databaseUrl
  ? (() => {
      const url = new URL(databaseUrl);

      if (url.hostname.includes("-pooler.")) {
        url.hostname = url.hostname.replace("-pooler", "");
      }

      return url.toString();
    })()
  : undefined;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: prismaUrl,
  },
});