import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
          redirectTo: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL,
        });
      }}
    >
      <Button type="submit" className="flex gap-2 w-full">
        <Image
          src={`/${provider}.svg`}
          width="20"
          height="20"
          alt="Google"
          className="pointer-events-none"
        />
        <span className="pointer-events-none">{config.title}</span>
      </Button>
    </form>
  );
}
