import { z } from "zod/v4";

const envSchema = z.object({
  NEXT_PUBLIC_ENV: z.enum(["dev", "stg", "prod"]).default("dev"),
  NEXT_PUBLIC_API_URL_DEV: z.string().min(1),
  NEXT_PUBLIC_API_URL_STG: z.string().min(1),
  NEXT_PUBLIC_API_URL_PROD: z.string().min(1),
  NEXT_PUBLIC_API_KEY: z.string().min(1),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_API_URL_DEV: process.env.NEXT_PUBLIC_API_URL_DEV,
  NEXT_PUBLIC_API_URL_STG: process.env.NEXT_PUBLIC_API_URL_STG,
  NEXT_PUBLIC_API_URL_PROD: process.env.NEXT_PUBLIC_API_URL_PROD,
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
});

if (!_env.success) {
  console.log("Invalid environment variables", z.treeifyError(_env.error));
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
