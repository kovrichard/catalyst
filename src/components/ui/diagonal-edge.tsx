import { cn } from "@/lib/utils";

interface DiagonalEdgeProps {
  corner: "tl" | "tr" | "bl" | "br";
  size?: number;
  color?: string;
  className?: string;
}

export function DiagonalEdge({
  corner,
  size = 64,
  color = "background",
  className,
}: DiagonalEdgeProps) {
  const colorVar = `var(--${color})`;

  const getBorderStyles = () => {
    const baseStyle = {
      borderStyle: "solid",
    };

    switch (corner) {
      case "tl":
        // Top-left corner: diagonal goes from bottom-left to top-right
        return {
          ...baseStyle,
          borderTopWidth: "0",
          borderBottomWidth: `${size}px`,
          borderLeftWidth: "100vw",
          borderRightWidth: "0",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: colorVar,
          borderRightColor: "transparent",
        };
      case "tr":
        // Top-right corner: diagonal goes from bottom-right to top-left
        return {
          ...baseStyle,
          borderTopWidth: "0",
          borderBottomWidth: `${size}px`,
          borderLeftWidth: "0",
          borderRightWidth: "100vw",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
          borderRightColor: colorVar,
        };
      case "br":
        // Bottom-right corner: diagonal goes from top-right to bottom-left
        return {
          ...baseStyle,
          borderTopWidth: `${size}px`,
          borderBottomWidth: "0",
          borderLeftWidth: "0",
          borderRightWidth: "100vw",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
          borderRightColor: colorVar,
        };
      case "bl":
        // Bottom-left corner: diagonal goes from top-left to bottom-right
        return {
          ...baseStyle,
          borderTopWidth: `${size}px`,
          borderBottomWidth: "0",
          borderLeftWidth: "100vw",
          borderRightWidth: "0",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: colorVar,
          borderRightColor: "transparent",
        };
    }
  };

  return <div className={cn("w-0 h-0", className)} style={getBorderStyles()} />;
}
