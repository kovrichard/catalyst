"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface CommandPaletteState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext = createContext<CommandPaletteState | null>(null);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette(): CommandPaletteState {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error("useCommandPalette requires a CommandPaletteProvider");
  }
  return context;
}
