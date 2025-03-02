import conf from "@/lib/config";
import publicConf from "@/lib/public-config";
import Script from "next/script";

export default function Analytics() {
  const isProd = conf.environment === "production";
  const analytics = publicConf.gaId;
  const tagManager = publicConf.gtmId;
  const ads = publicConf.googleAdsId;
  const clarity = publicConf.clarityId;

  return isProd ? (
    <>
      {analytics && (
        <>
          <Script
            async
            strategy="beforeInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics}`}
          ></Script>
          <Script strategy="beforeInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${analytics}');`}
          </Script>
        </>
      )}
      {tagManager && (
        <>
          <Script>
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${tagManager}');`}
          </Script>
          <noscript>
            <iframe
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

              gtag('config', '${ads}');`}
          </Script>
        </>
      )}
      {clarity && (
        <Script id="clarity" strategy="beforeInteractive">
          {`
            (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarity}");
          `}
        </Script>
      )}
    </>
  ) : null;
}
