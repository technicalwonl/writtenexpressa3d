"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only on desktop pointer devices
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("interactive"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let animationFrameId: number;
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const follow = () => {
      setTrailingPos((prev) => ({
        x: lerp(prev.x, position.x, 0.18),
        y: lerp(prev.y, position.y, 0.18),
      }));
      animationFrameId = requestAnimationFrame(follow);
    };
    animationFrameId = requestAnimationFrame(follow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position.x, position.y, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-99999 overflow-hidden transition-opacity duration-300">
      {/* Inner precise dot */}
      <div
        className="fixed top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-sm"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />
      {/* Outer interactive ring */}
      <div
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/60 transition-[width,height,background-color,border-color] duration-200 ease-out ${
          isHovered
            ? "h-11 w-11 bg-red-500/15 border-red-600 scale-110"
            : "h-7 w-7 bg-red-500/5"
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      />
    </div>
  );
}
