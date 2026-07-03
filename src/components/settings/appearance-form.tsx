"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted ? theme : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label>Theme</Label>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = active === option.value;
          return (
            <Button
              key={option.value}
              type="button"
              variant={isActive ? "default" : "outline"}
              className="h-auto flex-col gap-1.5 py-3"
              onClick={() => setTheme(option.value)}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{option.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
