'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import ArcadeCabinet from './ArcadeCabinet';

interface HeroSectionProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  totalRecords: number;
  filteredCount?: number;
  onOpenDataNotes?: () => void;
  onScrollToDashboard: () => void;
}

export default function HeroSection({
  totalRecords,
  onScrollToDashboard,
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const ensurePlay = () => {
      if (video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    if (video.readyState >= 2) {
      ensurePlay();
    } else {
      video.addEventListener('loadeddata', ensurePlay, { once: true });
      video.addEventListener('canplay', ensurePlay, { once: true });
    }

    // Resume playback if browser paused video on tab switch / background throttling
    const handleVisibility = () => {
      if (!document.hidden) {
        ensurePlay();
      }
    };

    // Fallback autoplay if browser strictly requires a user gesture first
    const handleUserGesture = () => {
      ensurePlay();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('scroll', handleUserGesture, { once: true, passive: true });
    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('touchstart', handleUserGesture, { once: true, passive: true });

    return () => {
      video.removeEventListener('loadeddata', ensurePlay);
      video.removeEventListener('canplay', ensurePlay);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('scroll', handleUserGesture);
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-b-2 border-card-border bg-[#0a0a18] min-h-screen flex flex-col justify-center pt-28 sm:pt-36 pb-24 sm:pb-36">
      {/* Video Background — Membentang penuh dari puncak layar (y=0) di belakang navbar transparan */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden flex items-center justify-center">
        {/* Still frame fallback underneath video so loading/loop transitions never flash black */}
        <Image
          src="/bg-video-poster.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          unoptimized
          className="object-cover opacity-90"
          style={{ transform: 'translate3d(0, 0, 0) scale(1.35)', transformOrigin: 'center center' }}
        />
        <video
          ref={videoRef}
          src="/bg-video.mp4?v=3"
          poster="/bg-video-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={(e) => {
            const v = e.currentTarget;
            v.muted = true;
            if (v.paused) v.play().catch(() => {});
          }}
          className="relative z-[1] w-full h-full object-cover opacity-90"
          style={{ transform: 'translate3d(0, 0, 0) scale(1.35)', transformOrigin: 'center center' }}
        />
        {/* Dark contrast overlay & arcade ambient lighting */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#0a0a18]/45 via-[#0a0a18]/20 to-[#0a0a18]/65" />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,255,136,0.08),transparent)]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (~55% width on desktop): Main Headline */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <h1 className="font-pixel font-bold tracking-tight text-left leading-[1.3] sm:leading-[1.25]">
              <span className="block text-[18px] sm:text-[28px] md:text-[34px] text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                SEJARAH VIDEO GAME UNTUK
              </span>
              <span className="block text-[18px] sm:text-[28px] md:text-[34px] text-primary glow-green mt-1 drop-shadow-[0_2px_8px_rgba(0,255,136,0.5)]">
                KECEPATAN DAN KONTROL.
              </span>
            </h1>
          </div>

          {/* Right Column: Arcade Cabinet (~45% width) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <ArcadeCabinet
              totalSales="8,820.01M"
              totalGames={totalRecords}
              onCoinInsert={onScrollToDashboard}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
