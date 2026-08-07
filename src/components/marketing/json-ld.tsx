import { canonicalUrl, metaTitle } from "@/lib/metadata";

type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json }) {
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script content; the payload is serialized here with < escaped
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}

export function organizationLd(overrides: Json = {}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: metaTitle,
    url: canonicalUrl,
    logo: `${canonicalUrl}/icon.svg`,
    ...overrides,
  };
}

export function webSiteLd(overrides: Json = {}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: metaTitle,
    url: canonicalUrl,
    publisher: { "@type": "Organization", name: metaTitle, url: canonicalUrl },
    ...overrides,
  };
}

export function softwareApplicationLd(overrides: Json = {}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: metaTitle,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: canonicalUrl,
    ...overrides,
  };
}

export function faqPageLd(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${canonicalUrl}${path}`,
    })),
  };
}
