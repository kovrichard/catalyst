import { signIn } from "@/auth";
import publicConf from "@/lib/public-config";
import OAuthButton from "./oauth-button";

export default function OAuthForm({ provider }: { provider: string }) {
  let config: { title: string } = { title: "" };

  if (provider === "google") {
    config.title = "Google";
  } else if (provider === "github") {
    config.title = "GitHub";
  }

  return (
    <form
      className="flex justify-center"
      action={async () => {
        "use server";

        await signIn(provider, {
          redirectTo: publicConf.redirectPath,
        });
      }}
    >
      <OAuthButton provider={provider} title={config.title} />
    </form>
  );
}
