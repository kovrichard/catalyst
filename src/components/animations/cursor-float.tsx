"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CursorFloatProps {
  children: ReactNode;
  className?: string;
  radius?: number;
  lag?: number;
  intensity?: number;
}

export function CursorFloat({
  children,
  className,
  radius = 50,
  lag = 2,
  intensity = 1,
}: CursorFloatProps) {
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);

  const elementRef = useRef<HTMLDivElement>(null);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const centerXRef = useRef(0);
  const centerYRef = useRef(0);

  // Convert lag in seconds to easing multiplier
  // Formula: multiplier = 1 - (0.05)^(1/(lag * 60))
  // This makes the animation reach ~95% completion in 'lag' seconds at 60fps
  const easingMultiplier = 1 - 0.05 ** (1 / (lag * 60));

  // Smooth animation loop with easing
  useEffect(() => {
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      const targetX = targetXRef.current;
      const targetY = targetYRef.current;
      const currentX = currentXRef.current;
      const currentY = currentYRef.current;

      // Ease-out for smooth deceleration
      const differenceX = targetX - currentX;
      const differenceY = targetY - currentY;
      const incrementX = differenceX * easingMultiplier;
      const incrementY = differenceY * easingMultiplier;

      if (Math.abs(differenceX) > 0.01 || Math.abs(differenceY) > 0.01) {
        currentXRef.current += incrementX;
        currentYRef.current += incrementY;
        setTranslateX(currentXRef.current);
        setTranslateY(currentYRef.current);
      } else {
        currentXRef.current = targetX;
        currentYRef.current = targetY;
        setTranslateX(targetX);
        setTranslateY(targetY);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [easingMultiplier]);

  // Check if element is in viewport
  useEffect(() => {
    const checkViewport = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;

      setIsInViewport(inView);

      // Update center position
      if (inView) {
        centerXRef.current = rect.left + rect.width / 2;
        centerYRef.current = rect.top + rect.height / 2;
      }
    };

    checkViewport();

    window.addEventListener("scroll", checkViewport, { passive: true });
    window.addEventListener("resize", checkViewport, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkViewport);
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  // Track mouse movement
  useEffect(() => {
    if (!isInViewport) {
      // Reset to center when not in viewport
      targetXRef.current = 0;
      targetYRef.current = 0;
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;

      const centerX = centerXRef.current;
      const centerY = centerYRef.current;

      // Calculate vector from center to cursor
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Calculate distance from center to cursor
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // If cursor is within radius, move to cursor position
      // If outside, move to the edge of the circle closest to cursor
      let targetX: number;
      let targetY: number;

      if (distance <= radius) {
        // Inside the circle - move to cursor position
        targetX = deltaX * intensity;
        targetY = deltaY * intensity;
      } else {
        // Outside the circle - move to the closest point on the circle edge
        const angle = Math.atan2(deltaY, deltaX);
        targetX = Math.cos(angle) * radius * intensity;
        targetY = Math.sin(angle) * radius * intensity;
      }

      targetXRef.current = targetX;
      targetYRef.current = targetY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isInViewport, radius, intensity]);

  return (
    <div
      ref={elementRef}
      className={cn("cursor-float", className)}
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    >
      {children}
    </div>
  );
}
