"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useRef } from "react";

const FloatingDiv2 = () => {
  // Motion value for y-offset based on scroll
  const yOffset = useMotionValue(0);

  // Apply a spring to create the lag effect
  const smoothYOffset = useSpring(yOffset, {
    stiffness: 30, // Adjust for lag responsiveness
    damping: 40, // Adjust for smoothness
    mass: 5, // Adjust if needed
  });

  // Reference to keep track of the last scroll position
  const lastScrollY = useRef(window.scrollY);

  // Handle scroll events
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;

      // Only proceed if there's a scroll delta
      if (deltaY !== 0) {
        // Calculate the new yOffset based on scroll delta
        // The multiplier controls the sensitivity
        let newYOffset = yOffset.get() + deltaY * 0.05;

        // Clamp the yOffset to a maximum of 10px in either direction
        newYOffset = Math.max(-10, Math.min(10, newYOffset));

        // Update the yOffset motion value
        yOffset.set(newYOffset);

        // Update the lastScrollY
        lastScrollY.current = currentScrollY;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", onScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", onScroll);
  }, [yOffset]);

  return (
    <motion.div
      style={{
        position: "fixed", // Fixed relative to the viewport
        top: "50%", // Vertically center
        left: "50%", // Horizontally center
        x: "-50%", // Adjust for true centering
        y: smoothYOffset, // Apply the smooth y-offset
        width: "100px", // Example width
        height: "100px", // Example height
        backgroundColor: "#3498db", // Example background color
        borderRadius: "10px", // Rounded corners
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "bold",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        pointerEvents: "none", // Allows clicks to pass through
        userSelect: "none", // Prevents text selection
      }}
    >
      Floating
    </motion.div>
  );
};

export default FloatingDiv2;
