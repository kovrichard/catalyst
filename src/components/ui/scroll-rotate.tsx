"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
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
  const elementRef = useRef<HTMLDivElement>(null);
  const targetRotationRef = useRef(startRotation);
  const currentRotationRef = useRef(startRotation);
  const animationFrameRef = useRef<number | undefined>(undefined);

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

      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate progress: 0 when element enters bottom, 1 when it exits top
      // Element enters at bottom of viewport
      const enterPoint = viewportHeight;
      // Element exits at top of viewport (negative rect.bottom means it's gone)
      const exitPoint = -rect.height;

      // Current position relative to these points
      const currentPosition = rect.top;

      // Calculate progress from 0 to 1
      const totalDistance = enterPoint - exitPoint;
      const traveledDistance = enterPoint - currentPosition;
      let progress = Math.max(0, Math.min(1, traveledDistance / totalDistance));

      // Apply stop percentage - clamp progress at the stop point
      const stopPoint = stopPercentage / 100;
      if (progress > stopPoint) {
        progress = stopPoint;
      }

      // Scale progress to 0-1 range based on stopPoint, then map to rotation
      const scaledProgress = progress / stopPoint;
      const targetRotation = startRotation + scaledProgress * degrees;

      // Update target instead of setting rotation directly
      targetRotationRef.current = targetRotation;
    };

    // Initial calculation
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [degrees, startRotation, stopPercentage]);

  return (
    <div
      ref={elementRef}
      className={cn("scroll-rotate", className)}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {children}
    </div>
  );
}
