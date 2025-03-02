import { z } from "zod";

const schema = z.object({
  // General
  scheme: z.string().default("https"),
  authority: z.string(),
  host: z.string().url(),

  // Auth
  redirectPath: z.string(),

  // Tracking
  gaId: z.string().optional(),
  gtmId: z.string().optional(),
  googleAdsId: z.string().optional(),
  clarityId: z.string().optional(),
});

const envVars = {
  // General
  scheme: process.env.NEXT_PUBLIC_SCHEME,
  authority: process.env.NEXT_PUBLIC_AUTHORITY,
  host: `${process.env.NEXT_PUBLIC_SCHEME || "https"}://${process.env.NEXT_PUBLIC_AUTHORITY}`,

  // Auth
  redirectPath: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL,

  // Tracking
  gaId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
};

const publicConf = schema.parse(envVars);

export default publicConf;
