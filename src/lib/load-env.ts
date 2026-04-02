import { config as dotenvConfig } from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Next.js only auto-loads root `.env*` files.
 * This helper additionally loads from a local `env/` folder if present.
 */
export function ensureEnvLoaded() {
  const cwd = process.cwd();

  const candidates = [
    join(cwd, "env", ".env.local"),
    join(cwd, "env", ".env"),
    join(cwd, "env", "local.env"),
    join(cwd, "env", "dev.env"),
  ];

  for (const p of candidates) {
    if (existsSync(p)) {
      dotenvConfig({ path: p });
    }
  }
}

