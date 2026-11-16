"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, Sparkles, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { brandConfig } from "@/config/brand";

const milestones = [
  { time: 0, label: "Closed Book", sub: "Every great idea deserves a beautiful expression." },
  { time: 4.5, label: "The Unfolding", sub: "Pages float outward into creative space." },
  { time: 9.0, label: "Transformation", sub: "Documents transform into presentation slides & laptop." },
  { time: 13.5, label: "Emergence", sub: "Personalized magazine & IoT technical rover assemble." },
  { time: 17.5, label: "Brand Universe", sub: "All elements converge into the Written Expressa identity." },
];

export function HeroVideoExperience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(20);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMilestone, setActiveMilestone] = useState(milestones[0]);

  // Handle Video Time Update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 20;
    setCurrentTime(cur);
    setDuration(dur);
    const prog = Math.min(100, Math.max(0, (cur / dur) * 100));
    setProgress(prog);

    // Update active milestone
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (cur >= milestones[i].time) {
        setActiveMilestone(milestones[i]);
        break;
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-red-700 text-xs font-bold tracking-wider uppercase mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>3D Creative Universe • Cinematic Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.12]">
            Your Ideas. Our Creativity. <br className="hidden sm:inline" />
            <span className="text-red-600 relative inline-block">
              One Expressive Result.
              <span className="absolute bottom-1 left-0 w-full h-[3px] bg-red-600/30 rounded-full" />
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {brandConfig.heroSupportingDescription}
          </p>
        </div>

        {/* Cinematic 3D Video Showcase Player */}
        <div
          ref={containerRef}
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-zinc-200/90 shadow-2xl bg-zinc-950 group"
        >
          {/* HTML5 Native Video Tag - Plays Full Animation Smoothly */}
          <video
            ref={videoRef}
            src="/videos/written-expressa-full.mp4"
            poster="/images/book-closed.webp"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-auto aspect-16/9 object-cover"
          />

          {/* Top Floating Badge */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>{activeMilestone.label}</span>
          </div>

          {/* Bottom Floating Dynamic Milestone Subtitle */}
          <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 sm:left-8 sm:right-8 z-20 pointer-events-none text-center">
            <div className="inline-block bg-black/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white text-xs sm:text-sm font-medium shadow-lg">
              {activeMilestone.sub}
            </div>
          </div>

          {/* Video Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-5 flex flex-col gap-2">
            {/* Timeline Progress Bar / Scrubber */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-zinc-400">
                {Math.floor(currentTime)}s
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-hidden"
              />
              <span className="text-[11px] font-mono text-zinc-400">
                {Math.floor(duration)}s
              </span>
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-between text-white pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-white/20 hover:bg-red-600 transition-colors text-white"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                  aria-label="Replay animation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <span className="text-xs font-semibold text-zinc-300 hidden sm:inline">
                  Written Expressa: From imagination to presentation.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Milestones Grid Below Video */}
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {milestones.map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = m.time;
                  videoRef.current.play();
                }
              }}
              className={`p-3 rounded-2xl border transition-all text-left ${
                activeMilestone.label === m.label
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                  : "bg-zinc-50 text-zinc-700 border-zinc-200/80 hover:bg-white hover:border-red-500/40"
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider block ${
                  activeMilestone.label === m.label ? "text-red-400" : "text-zinc-600"
                }`}
              >
                Stage 0{idx + 1}
              </span>
              <span className="text-xs font-bold block mt-0.5 truncate">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
