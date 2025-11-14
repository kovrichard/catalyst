import { cn } from "@/lib/utils";

interface DiagonalEdgeProps {
  corner: "tl" | "tr" | "bl" | "br";
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Renders a zero-size absolutely positioned element that visually produces a diagonal corner edge.
 *
 * Renders CSS borders sized and colored to form a diagonal triangle at the specified corner.
 *
 * @param corner - Which corner to place the diagonal edge in: "tl", "tr", "bl", or "br"
 * @param size - Depth of the diagonal edge in pixels (default: 64)
 * @param color - CSS variable name (without `--`) used for the edge color (default: "background")
 * @param className - Additional class names applied to the container element
 * @returns A React element that creates a diagonal corner edge using CSS borders
 */
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

  const positionClasses = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  };

  return (
    <div
      className={cn("absolute h-0 w-0", positionClasses[corner], className)}
      style={getBorderStyles()}
    />
  );
}