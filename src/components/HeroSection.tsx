'use client';

import React, { useRef, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import ArcadeCabinet from './ArcadeCabinet';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalRecords: number;
  filteredCount: number;
  onOpenDataNotes?: () => void;
  onScrollToDashboard: () => void;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
  totalRecords,
  filteredCount,
  onOpenDataNotes,
  onScrollToDashboard,
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScrollToDashboard();
  };

  return (
    <section className="relative overflow-hidden border-b-2 border-card-border bg-[#0a0a18] pt-24 sm:pt-28 pb-8 sm:pb-14">
      {/* Video Background — Membentang penuh dari puncak layar (y=0) di belakang navbar transparan */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-85 transition-transform duration-300"
          style={{ transform: 'scale(1.25)', transformOrigin: 'center center' }}
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        {/* Dark contrast overlay & arcade ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a18]/70 via-[#0a0a18]/50 to-[#0a0a18]/80 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,255,136,0.08),transparent)]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (~55% width on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Main Headline (Brex-scale, Retro-crafted) */}
            <h1 className="font-pixel font-bold tracking-tight text-left leading-[1.3] sm:leading-[1.25]">
              <span className="block text-[18px] sm:text-[28px] md:text-[34px] text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                SEJARAH VIDEO GAME UNTUK
              </span>
              <span className="block text-[18px] sm:text-[28px] md:text-[34px] text-primary glow-green mt-1 drop-shadow-[0_2px_8px_rgba(0,255,136,0.5)]">
                KECEPATAN DAN KONTROL.
              </span>
            </h1>

            {/* Action Row: Search input + CTA Button (Brex email capture style) */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-2 p-1.5 border-2 border-card-border bg-card/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="> Cari judul game, platform (PS4, NES), penerbit..."
                    className="w-full h-11 pl-9 pr-3 bg-transparent text-foreground font-retro text-base sm:text-lg placeholder:text-muted/60 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="pixel-btn h-11 px-5 border-primary bg-primary text-background font-pixel text-[8px] sm:text-[9px] hover:bg-primary/90 flex items-center justify-center gap-1.5 transition-colors tracking-wider flex-shrink-0 cursor-pointer"
                >
                  <span>JELAJAHI DATA</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="px-2.5 py-1 border border-card-border bg-card font-retro text-xs sm:text-sm text-muted">
                Penjualan: <span className="text-primary font-bold">8.820,01M</span>
              </div>
              <div className="px-2.5 py-1 border border-card-border bg-card font-retro text-xs sm:text-sm text-muted">
                Judul Game: <span className="text-secondary font-bold">16.322</span>
              </div>
              <div className="px-2.5 py-1 border border-card-border bg-card font-retro text-xs sm:text-sm text-muted">
                Platform: <span className="text-accent font-bold">31 Aktif</span>
              </div>
              <div className="px-2.5 py-1 border border-card-border bg-card font-retro text-xs sm:text-sm text-muted">
                Era: <span className="text-rose font-bold">1980–2016</span>
              </div>
            </div>

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
