import conf from "@/lib/config";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export default function Analytics() {
  const isProd = conf.environment === "production";
  const analytics = process.env.NEXT_PUBLIC_GA_ID;
  const tagManager = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    isProd && (
      <>
        {analytics && <GoogleAnalytics gaId={analytics as string} />}
        {tagManager && <GoogleTagManager gtmId={tagManager as string} />}
      </>
    )
  );
}
