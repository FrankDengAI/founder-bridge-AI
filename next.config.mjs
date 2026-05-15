/** @type {import('next').NextConfig} */
const vercelOrigin =
  process.env.VERCEL_URL && !process.env.VERCEL_URL.startsWith("http")
    ? `https://${process.env.VERCEL_URL}`
    : "";

const nextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL:
      (process.env.NEXT_PUBLIC_SITE_URL || vercelOrigin || "").replace(
        /\/$/,
        "",
      ),
  },
  async headers() {
    const fromEnv = process.env.FRAME_ANCESTOR_ORIGINS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const frameAncestors = fromEnv?.length
      ? [...new Set(["'self'", ...fromEnv])]
      : [
          "'self'",
          "https://*.vercel.app",
          "http://localhost:3000",
          "http://localhost:3001",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:3001",
        ];
    return [
      {
        source: "/welcome/login",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${frameAncestors.join(" ")};`,
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev && process.platform === "win32") {
      const ignored =
        /[\\/]node_modules[\\/]|[\\/]\.git[\\/]|[\\/](?:pagefile|swapfile|hiberfil)\.sys(?:$|[\\/])|[\\/]DumpStack\.log\.tmp(?:$|[\\/])|System Volume Information|^[a-zA-Z]:\\(?:pagefile|swapfile|hiberfil)\.sys$|^\\\\\?\\[a-zA-Z]:\\(?:pagefile|swapfile|hiberfil)\.sys$|^[a-zA-Z]:\\DumpStack\.log\.tmp$|^\\\\\?\\[a-zA-Z]:\\DumpStack\.log\.tmp$|^[a-zA-Z]:\\System Volume Information(?:[\\/]|$)|^\\\\\?\\[a-zA-Z]:\\System Volume Information(?:[\\/]|$)/i;
      if (process.env.NEXT_DISABLE_WIN_POLL === "1") {
        config.watchOptions = { ...config.watchOptions, ignored };
      } else {
        config.watchOptions = {
          ...config.watchOptions,
          poll: 1000,
          aggregateTimeout: 300,
          ignored,
        };
      }
      config.resolve = { ...config.resolve, symlinks: false };
    }
    return config;
  },
};

export default nextConfig;
