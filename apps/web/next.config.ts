import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

// Load env from repo root so the app uses a single .env.local
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
