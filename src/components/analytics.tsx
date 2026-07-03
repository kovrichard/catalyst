"use client";

import Clarity from "@microsoft/clarity";
import Script from "next/script";
import { useEffect } from "react";

export default function Analytics({
  environment,
  gaId,
  gtmId,
  googleAdsId,
  clarityId,
}: Readonly<{
  environment: string;
  gaId?: string;
  gtmId?: string;
  googleAdsId?: string;
  clarityId?: string;
}>) {
  const isProd = environment === "production";
  const analytics = gaId;
  const tagManager = gtmId;
  const ads = googleAdsId;

  useEffect(() => {
    const consent = localStorage.getItem("clarity-consent");
    const granted = consent === "granted";

    if (isProd && clarityId) {
      Clarity.init(clarityId);

      if (granted) {
        Clarity.consent();
      } else {
        Clarity.consent(false);
      }
    }
  }, [isProd, clarityId]);

  return isProd ? (
    <>
      {analytics && (
        <>
          <Script
            async
            strategy="beforeInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics}`}
          ></Script>
          <Script id="google-analytics" strategy="beforeInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${analytics}', {
                'allow_google_signals': false,
                'allow_ad_personalization_signals': false
              });

              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
              });

              // Check for existing consent
              const consent = localStorage.getItem('ga-consent');
              if (consent === 'granted') {
                gtag('consent', 'update', {
                  'ad_storage': 'granted',
                  'ad_user_data': 'granted',
                  'ad_personalization': 'granted',
                  'analytics_storage': 'granted'
                });
              }
            `}
          </Script>
        </>
      )}
      {tagManager && (
        <>
          <Script id="google-tag-manager">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${tagManager}');`}
          </Script>
          <noscript>
            <iframe
              title="Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${tagManager}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        </>
      )}
      {ads && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ads}`}
            strategy="beforeInteractive"
          />
          <Script id="google-ads" strategy="beforeInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${ads}', {
                'allow_google_signals': false,
                'allow_ad_personalization_signals': false
              });`}
          </Script>
        </>
      )}
    </>
  ) : null;
}
