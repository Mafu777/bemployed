import { cookies } from "next/headers";

const COOKIE_NAME = "bemployed_admin_session";
const SESSION_VALUE = "authenticated";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set in your environment variables");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(signature);
}

export async function createSessionCookieValue(): Promise<string> {
  const signature = await sign(SESSION_VALUE);
  return `${SESSION_VALUE}.${signature}`;
}

export async function isValidSessionCookieValue(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = await sign(payload);
  return payload === SESSION_VALUE && signature === expected;
}

export function checkAdminCredentials(username: string, password: string): boolean {
  const validUsername = process.env.ADMIN_USERNAME || "";
  const validPassword = process.env.ADMIN_PASSWORD || "";
  return username === validUsername && password === validPassword;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_SECONDS;

export async function isLoggedInFromCookies(): Promise<boolean> {
  const store = cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return isValidSessionCookieValue(value);
}
