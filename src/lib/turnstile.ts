import conf from "@/lib/config";

export const turnstileFailedResponse = {
  message: "Validation failed",
  description: "Please verify you are human.",
  success: false,
};

export async function verifyTurnstile(response?: string): Promise<boolean> {
  if (!conf.turnstileSecretKey) {
    return true;
  }

  if (!response) {
    return false;
  }

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: conf.turnstileSecretKey,
        response: response,
      }),
    }
  );
  const verifyJson = await verifyRes.json();

  return verifyJson.success;
}
