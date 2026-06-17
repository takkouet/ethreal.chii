// Public site origin for SEO (canonical, OpenGraph, sitemap). Falls back to the
// Vercel-provided URL, then localhost in dev. No trailing slash.
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
