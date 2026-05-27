/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["ffmpeg-static"],
  // Allow loading the dev server over the LAN/VPN (e.g. from a phone) without
  // Next.js blocking cross-origin /_next/* requests in future versions.
  allowedDevOrigins: ["192.168.0.16"]
};

export default nextConfig;
