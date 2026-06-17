import "server-only";

/**
 * Validates required server environment variables. Throws on misconfiguration
 * so failures surface at first server use rather than as confusing 401s/500s.
 */
function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export function getAuthSecret(): string {
  const s = requireEnv("AUTH_SECRET");
  if (s.length < 32) {
    throw new Error(
      "AUTH_SECRET must be at least 32 characters (generate: openssl rand -base64 32)"
    );
  }
  return s;
}
