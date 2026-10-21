import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old Discover-era URLs now live on the home page and /rankings.
  async redirects() {
    return [
      { source: "/discover", destination: "/", permanent: false },
      { source: "/discover/:path*", destination: "/", permanent: false },
      { source: "/courses", destination: "/", permanent: false },
      { source: "/professors", destination: "/rankings", permanent: false },
    ];
  },
};

export default nextConfig;
