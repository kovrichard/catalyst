import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-1 min-h-screen bg-gray-100">
      <div className="flex-1 flex">{children}</div>
    </main>
  );
}
