import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "romantic-victory-de00aedaff.media.strapiapp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
