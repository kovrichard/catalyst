"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollFloatProps {
  children: ReactNode;
  className?: string;
  direction?: "x" | "y" | "both";
  distance?: number;
  distanceX?: number;
  distanceY?: number;
  startX?: number;
  startY?: number;
  stopPercentage?: number;
  lag?: number;
}

export function ScrollFloat({
  children,
  className,
  direction = "y",
  distance = 50,
  distanceX,
  distanceY,
  startX = 0,
  startY = 0,
  stopPercentage = 100,
  lag = 1,
}: ScrollFloatProps) {
  const [translateX, setTranslateX] = useState(startX);
  const [translateY, setTranslateY] = useState(startY);
  const [isReady, setIsReady] = useState(false);

  const elementRef = useRef<HTMLDivElement>(null);
  const targetXRef = useRef(startX);
  const targetYRef = useRef(startY);
  const currentXRef = useRef(startX);
  const currentYRef = useRef(startY);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const hasInitializedRef = useRef(false);

  // Determine actual distances based on direction
  const finalDistanceX =
    distanceX ?? (direction === "x" || direction === "both" ? distance : 0);
  const finalDistanceY =
    distanceY ?? (direction === "y" || direction === "both" ? distance : 0);

  // Convert lag in seconds to easing multiplier
  // Formula: multiplier = 1 - (0.05)^(1/(lag * 60))
  // This makes the animation reach ~95% completion in 'lag' seconds at 60fps
  const easingMultiplier = 1 - 0.05 ** (1 / (lag * 60));

  // Calculate translation based on current scroll position
  const calculateTranslation = useCallback(() => {
    if (!elementRef.current) return { x: startX, y: startY };

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const enterPoint = viewportHeight;
    const exitPoint = -rect.height;
    const currentPosition = rect.top;

    const totalDistance = enterPoint - exitPoint;
    const traveledDistance = enterPoint - currentPosition;
    let progress = Math.max(0, Math.min(1, traveledDistance / totalDistance));

    const stopPoint = stopPercentage / 100;
    if (progress > stopPoint) {
      progress = stopPoint;
    }

    const scaledProgress = progress / stopPoint;

    return {
      x: startX + scaledProgress * finalDistanceX,
      y: startY + scaledProgress * finalDistanceY,
    };
  }, [finalDistanceX, finalDistanceY, startX, startY, stopPercentage]);

  // Smooth animation loop with easing
  useEffect(() => {
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      const targetX = targetXRef.current;
      const targetY = targetYRef.current;
      const currentX = currentXRef.current;
      const currentY = currentYRef.current;

      // Ease-out for smooth deceleration (like momentum/inertia)
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

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const translation = calculateTranslation();

      // On first calculation, set instantly without animation
      if (!hasInitializedRef.current) {
        targetXRef.current = translation.x;
        targetYRef.current = translation.y;
        currentXRef.current = translation.x;
        currentYRef.current = translation.y;
        setTranslateX(translation.x);
        setTranslateY(translation.y);
        hasInitializedRef.current = true;
        setIsReady(true);
      } else {
        // After initialization, only update target for smooth animation
        targetXRef.current = translation.x;
        targetYRef.current = translation.y;
      }
    };

    // Initial calculation - will set position instantly
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [calculateTranslation]);

  return (
    <div
      ref={elementRef}
      className={cn("scroll-float", className)}
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
        visibility: isReady ? "visible" : "hidden",
      }}
    >
      {children}
    </div>
  );
}
