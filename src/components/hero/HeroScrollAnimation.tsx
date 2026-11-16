"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const TOTAL_FRAMES = 150;

export function HeroScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const mouseOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [scrollProgress, setScrollProgress] = useState(0);

  // Preload all 150 frames with highest priority
  useEffect(() => {
    const images: HTMLImageElement[] = [];

    // Instant load of first frame
    const firstImg = new Image();
    firstImg.src = "/hero-sequence/frame_000.webp";
    firstImg.onload = () => {
      images[0] = firstImg;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          drawScaledImage(ctx, firstImg, canvasRef.current.width, canvasRef.current.height);
        }
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/hero-sequence/frame_${i.toString().padStart(3, "0")}.webp`;
      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  const drawScaledImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    // Apply gentle interactive mouse parallax
    const px = mouseOffsetRef.current.x * 12;
    const py = mouseOffsetRef.current.y * 8;

    ctx.drawImage(img, offsetX + px, offsetY + py, drawWidth, drawHeight);
  };

  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const img = imagesRef.current[Math.round(currentFrameRef.current)];
      if (img) {
        drawScaledImage(ctx, img, canvas.width, canvas.height);
      }
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Mouse tracking for subtle 3D interactive depth
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseOffsetRef.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Silky smooth, slow framerate damping loop
  useEffect(() => {
    let animationFrameId: number;

    const updateFrame = () => {
      // Gentle damping factor (0.065) creates that slow, luxurious, cinematic gliding feel
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.065;

      const frameToDraw = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const img = imagesRef.current[frameToDraw];
        if (ctx && img && img.complete) {
          drawScaledImage(ctx, img, canvas.width, canvas.height);
        }
      }

      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);

    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / containerHeight));

      setScrollProgress(progress);
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      id="hero"
      // Extended height (520vh) gives slow, smooth, physically believable scroll pacing
      className="relative h-[520vh] w-full bg-white select-none"
    >
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Fullscreen 3D Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-white/5 to-white/50 pointer-events-none" />

        {/* Minimal Scroll Depth Indicator at bottom right */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-zinc-200/60 shadow-xs pointer-events-none transition-opacity duration-300">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-600 uppercase">
            3D Scroll • {Math.round(scrollProgress * 100)}%
          </span>
        </div>

        {/* HERO INTRO CONTENT (Fades smoothly as user begins scrolling) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 pointer-events-none ${
            scrollProgress < 0.18
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-12 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center pointer-events-auto">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/80 mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-bold tracking-wider text-red-700 uppercase">
                Your Creative & Academic Partner
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.12]">
              Your Ideas. Our Creativity. <br className="hidden sm:inline" />
              <span className="text-red-600 relative inline-block">
                One Expressive Result.
                <span className="absolute bottom-1 left-0 w-full h-[3px] bg-red-600/30 rounded-full" />
              </span>
            </h1>

            {/* Supporting description */}
            <p className="mt-5 text-base sm:text-lg text-zinc-700 max-w-2xl font-normal leading-relaxed">
              From academic presentations and documentation to personalized magazines and technical
              solutions, Written Expressa helps turn your ideas into professionally crafted experiences.
            </p>

            {/* Hero Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <MagneticButton
                onClick={() => scrollToSection("services")}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider"
              >
                Explore Services
              </MagneticButton>

              <MagneticButton
                onClick={() => scrollToSection("contact")}
                className="w-full sm:w-auto bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 font-bold px-7 py-3.5 rounded-full shadow-xs hover:shadow-md transition-all text-xs uppercase tracking-wider"
              >
                Get a Free Consultation
              </MagneticButton>
            </div>

            {/* Subtle Scroll Cue */}
            <div className="mt-12 flex flex-col items-center gap-2 text-zinc-500 animate-bounce">
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Scroll slowly to move through the 3D universe
              </span>
              <ArrowDown className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>

        {/* FINAL COMPOSITION OVERLAY (Reveals cleanly near the end of scroll) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 px-6 text-center transition-all duration-700 pointer-events-none ${
            scrollProgress >= 0.88
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="max-w-xl mx-auto rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-7 border border-zinc-200/90 shadow-2xl flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">
              Written Expressa
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight mt-1">
              From imagination to presentation.
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-md">
              &quot;Your ideas deserve more than ordinary execution.&quot; Continue downward to explore our
              specialized divisions and interactive service models.
            </p>
            <div className="mt-4">
              <button
                onClick={() => scrollToSection("services")}
                className="bg-zinc-900 hover:bg-red-600 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
              >
                <span>ORDER & EXPLORE SERVICES</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
