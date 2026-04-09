/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    '@payloadcms/db-postgres',
    '@payloadcms/drizzle',
    'drizzle-kit',
    'drizzle-orm',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@libsql/linux-x64-gnu': false,
      '@libsql/linux-arm64-gnu': false,
      '@libsql/darwin-x64': false,
      '@libsql/darwin-arm64': false,
      '@libsql/win32-x64': false,
    };
    return config;
  },
};

export default nextConfig;
