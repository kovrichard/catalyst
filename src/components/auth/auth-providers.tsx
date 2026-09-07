import { connection } from "next/server";
import OAuthForm from "@/components/auth/oauth-form";
import PasskeySignInButton from "@/components/auth/passkey-sign-in-button";
import conf from "@/lib/config";

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-card px-2 text-muted-foreground">OR</span>
      </div>
    </div>
  );
}

// The OAuth credentials are absent from the image build, so a prerendered shell
// would omit buttons the running container renders. Only this block needs request
// time, which keeps the rest of the card in the prerender.
export default async function AuthProviders({
  showOAuth = true,
  showPasskey = false,
}: {
  showOAuth?: boolean;
  showPasskey?: boolean;
}) {
  await connection();

  const hasGoogle = Boolean(conf.googleId) && Boolean(conf.googleSecret);
  const oauth = showOAuth && hasGoogle;

  if (!oauth && !showPasskey) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {oauth ? <OAuthForm provider="google" /> : null}
        {showPasskey ? <PasskeySignInButton /> : null}
      </div>
      <Divider />
    </div>
  );
}
