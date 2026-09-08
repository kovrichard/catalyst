import Link from "next/link";
import { display } from "@/lib/fonts";
import { meteorMask } from "@/lib/utils/meteor-mask";

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
