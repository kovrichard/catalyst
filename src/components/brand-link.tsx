import Image from "next/image";
import Link from "next/link";

export default function BrandLink() {
  return (
    <Link
      href="/"
      className="mr-auto flex items-center gap-2 whitespace-pre font-medium text-lg"
    >
      <Image src="/icon.svg" alt="Catalyst" width={30} height={30} />
      Catalyst
    </Link>
  );
}
