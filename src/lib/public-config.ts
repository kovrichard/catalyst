import { z } from "zod";

const schema = z.object({
  // @catalyst:auth-start
  // Auth
  redirectPath: z.string().default("/dashboard"),
  // @catalyst:auth-end

  // Tracking
  gaId: z.string().optional(),
  gtmId: z.string().optional(),
  googleAdsId: z.string().optional(),
  clarityId: z.string().optional(),

  // @catalyst:auth-start
  // Turnstile
  turnstileSiteKey: z.string().optional(),
  // @catalyst:auth-end
});

const envVars = {
  // @catalyst:auth-start
  // Auth
  redirectPath: process.env.NEXT_PUBLIC_AUTH_REDIRECT_PATH || "/dashboard",
  // @catalyst:auth-end

  // Tracking
  gaId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,

  // @catalyst:auth-start
  // Turnstile
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY,
  // @catalyst:auth-end
};

const publicConf = schema.parse(envVars);

export default publicConf;
