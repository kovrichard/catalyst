import Link from "next/link";
import { display } from "@/lib/fonts";

const meteorMask = {
  maskImage: "url(/meteor.svg)",
  maskSize: "contain",
  maskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskImage: "url(/meteor.svg)",
  WebkitMaskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
};

export default function BrandLink() {
  return (
    <Link
      href="/"
      className={`${display.className} mr-auto flex items-center gap-2 whitespace-pre font-bold text-xl tracking-tight`}
    >
      <span
        aria-hidden="true"
        className="size-[30px] shrink-0 bg-current"
        style={meteorMask}
      />
      Catalyst
    </Link>
  );
}
