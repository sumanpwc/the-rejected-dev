import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    allowedDevOrigins: ["http://192.168.0.183:3000"], // or whatever port you're using
};

export default nextConfig;
