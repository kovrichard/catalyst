import "server-only";
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
  redirectPath: process.env.AUTH_REDIRECT_PATH || "/dashboard",
  // @catalyst:auth-end

  // Tracking
  gaId: process.env.GOOGLE_ANALYTICS_ID,
  gtmId: process.env.GOOGLE_TAG_MANAGER_ID,
  googleAdsId: process.env.GOOGLE_ADS_ID,
  clarityId: process.env.CLARITY_ID,

  // @catalyst:auth-start
  // Turnstile
  turnstileSiteKey: process.env.TURNSTILE_SITEKEY,
  // @catalyst:auth-end
};

export type PublicConfig = z.infer<typeof schema>;

const publicConf: PublicConfig = schema.parse(envVars);

export default publicConf;
