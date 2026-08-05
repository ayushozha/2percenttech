/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — the whole site deploys as plain files, which is what the
  // nginx image in ./Dockerfile serves. Auth and the dashboard are entirely
  // client-side (see lib/store.ts), so nothing here needs a Node runtime.
  output: 'export',

  // Every route becomes a directory with an index.html, so /dashboard resolves
  // without server-side rewrites on a plain static host.
  trailingSlash: true,

  images: {
    // next/image's optimiser needs a server; the export build has none.
    unoptimized: true,
  },
};

export default nextConfig;
