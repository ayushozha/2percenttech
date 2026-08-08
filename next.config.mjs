/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — the landing page is entirely client-side (the intake form
  // writes to localStorage, the agent panel is local), so there is nothing here
  // that needs a Node runtime at request time.
  output: 'export',

  // Every route becomes a directory with an index.html so paths resolve on a
  // plain static host without rewrites.
  trailingSlash: true,

  images: {
    // next/image's optimiser needs a server; the export build has none. The
    // photos in public/ are already sized and encoded as webp.
    unoptimized: true,
  },
};

export default nextConfig;
