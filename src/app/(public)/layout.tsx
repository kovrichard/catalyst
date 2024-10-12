import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <footer className="flex w-full p-4 justify-center">
        <a
          href="https://github.com/kovrichard/catalyst"
          target="_blank"
          className="fixed bottom-4 left-4 text-sm py-1 px-2 rounded flex items-center gap-1.5 shadow-lg hover:bg-slate-100 transition border border-slate-400 hover:border-slate-600"
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
      </footer>
    </>
  );
}
