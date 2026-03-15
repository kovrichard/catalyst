"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SignInButton() {
  const { setOpenMobile } = useSidebar();

  const handleClick = () => {
    setOpenMobile(false);
  };

  return (
    <Button className="w-full" onClick={handleClick}>
      Log in
    </Button>
  );
}
