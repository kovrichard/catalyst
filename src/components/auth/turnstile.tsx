import { Turnstile } from "@marsidev/react-turnstile";
import publicConf from "@/lib/public-config";

export default function TurnstileComponent({
  setValue,
}: Readonly<{
  setValue: (token: string) => void;
}>) {
  if (!publicConf.turnstileSiteKey) {
    return null;
  }

  return (
    <Turnstile
      className="mx-auto"
      siteKey={publicConf.turnstileSiteKey}
      onSuccess={(token: string) => {
        setValue(token);
      }}
      onError={() => {
        setValue("");
      }}
      onExpire={() => {
        setValue("");
      }}
      onTimeout={() => {
        setValue("");
      }}
    />
  );
}
