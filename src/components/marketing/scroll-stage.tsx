import type { CSSProperties, ReactNode } from "react";

export function ScrollStage({
  runway,
  children,
}: {
  runway: string;
  children: ReactNode;
}) {
  return (
    <div className="relative w-full" style={{ height: runway }}>
      <div className="sticky top-header h-[calc(100svh-var(--spacing-header))]">
        {children}
      </div>
    </div>
  );
}

export function StageSlide({
  from,
  to,
  className,
  children,
}: {
  from?: string;
  to?: string;
  className?: string;
  children: ReactNode;
}) {
  const arrives = from !== undefined && to !== undefined;

  return (
    <div
      className={`${arrives ? "stage-slide" : ""} absolute inset-0 flex items-center justify-center ${className ?? ""}`}
      style={
        arrives
          ? ({ "--stage-from": from, "--stage-to": to } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}

export function StageAnchor({ id, at }: { id: string; at: string }) {
  return <div id={id} className="absolute w-px" style={{ top: at }} />;
}
