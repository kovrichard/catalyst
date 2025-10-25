import { Turnstile } from "@marsidev/react-turnstile";
import publicConf from "@/lib/public-config";

export default function TurnstileComponent({
  onSuccess,
}: Readonly<{
  onSuccess: (token: string) => void;
}>) {
  if (!publicConf.turnstileSiteKey) {
    return null;
  }

  return (
    <Turnstile
      className="mx-auto"
      siteKey={publicConf.turnstileSiteKey}
      onSuccess={(token: string) => {
        onSuccess(token);
      }}
    />
  );
}
