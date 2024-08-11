/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["http://localhost:3000", "https://fonts.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;