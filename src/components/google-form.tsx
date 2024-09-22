import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GoogleForm() {
  return (
    <form
      className="flex justify-center"
      action={async () => {
        "use server";

        await signIn("google", {
          redirectTo: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL,
        });
      }}
    >
      <Button type="submit" className="flex gap-2 w-full">
        <Image
          src="/google.svg"
          width="20"
          height="20"
          alt="Google"
          className="pointer-events-none"
        />
        <span className="pointer-events-none">Google</span>
      </Button>
    </form>
  );
}
