"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRotateProps {
  children: ReactNode;
  className?: string;
  degrees?: number;
  startRotation?: number;
  stopPercentage?: number;
}

export function ScrollRotate({
  children,
  className,
  degrees = 5,
  startRotation = -5,
  stopPercentage = 50,
}: ScrollRotateProps) {
  const [rotation, setRotation] = useState(startRotation);
  const [isReady, setIsReady] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const targetRotationRef = useRef(startRotation);
  const currentRotationRef = useRef(startRotation);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const hasInitializedRef = useRef(false);

  // Calculate rotation based on current scroll position
  const calculateRotation = useCallback(() => {
    if (!elementRef.current) return startRotation;

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
    return startRotation + scaledProgress * degrees;
  }, [degrees, startRotation, stopPercentage]);

  // Smooth animation loop with easing
  useEffect(() => {
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      const target = targetRotationRef.current;
      const current = currentRotationRef.current;

      // Ease-out for smooth deceleration (like momentum/inertia)
      const difference = target - current;
      const increment = difference * 0.08; // Adjust this for more/less lag (lower = more lag)

      if (Math.abs(difference) > 0.01) {
        currentRotationRef.current += increment;
        setRotation(currentRotationRef.current);
      } else {
        currentRotationRef.current = target;
        setRotation(target);
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
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const targetRotation = calculateRotation();

      // On first calculation, set instantly without animation
      if (!hasInitializedRef.current) {
        targetRotationRef.current = targetRotation;
        currentRotationRef.current = targetRotation;
        setRotation(targetRotation);
        hasInitializedRef.current = true;
        setIsReady(true);
      } else {
        // After initialization, only update target for smooth animation
        targetRotationRef.current = targetRotation;
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
  }, [calculateRotation]);

  return (
    <div
      ref={elementRef}
      className={cn("scroll-rotate", className)}
      style={{
        transform: `rotate(${rotation}deg)`,
        visibility: isReady ? "visible" : "hidden",
      }}
    >
      {children}
    </div>
  );
}
