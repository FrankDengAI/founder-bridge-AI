/** @type {import('next').NextConfig} */
const nextConfig = {
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
