import { headers } from "next/headers";

export default function CatalystBadge() {
  const headersList = headers();
  const domain = headersList.get("host");

  return (
    <a
      href={`https://catalyst.richardkovacs.dev?ref=${domain}`}
      target="_blank"
      className="text-sm py-1 px-2 rounded flex items-center gap-1.5 shadow-md bg-card dark:bg-input border text-foreground hover:bg-input/50 transition-colors"
    >
      <span>Made with</span>
      <img
        src="https://raw.githubusercontent.com/kovrichard/catalyst/refs/heads/main/src/app/icon.png"
        alt="Catalyst"
        width={20}
        height={20}
      />
      <span className="font-semibold">Catalyst</span>
    </a>
  );
}
