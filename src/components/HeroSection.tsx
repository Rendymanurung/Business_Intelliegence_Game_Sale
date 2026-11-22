'use client';

import React from 'react';
import { Search, ArrowDown, FileText, Sparkles, ChevronRight } from 'lucide-react';
import ArcadeCabinet from './ArcadeCabinet';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalRecords: number;
  filteredCount: number;
  onOpenDataNotes: () => void;
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScrollToDashboard();
  };

  return (
    <section className="relative overflow-hidden border-b-2 border-card-border bg-gradient-to-b from-background via-background-alt to-background py-8 sm:py-14">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,255,136,0.06),transparent)] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (~55% width on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5 sm:space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/40 bg-primary-light font-pixel text-[7.5px] sm:text-[8.5px] text-primary tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <span>KRISTAL BI WORKBENCH</span>
              <span className="text-muted">·</span>
              <span className="text-accent">1980–2016 ARCHIVE</span>
            </div>

            {/* Main Headline (Brex-scale, Retro-crafted) */}
            <h1 className="font-pixel font-bold tracking-tight text-left leading-[1.3] sm:leading-[1.25]">
              <span className="block text-[18px] sm:text-[28px] md:text-[34px] text-foreground">
                GAMING HISTORY BUILT FOR
              </span>
              <span className="block text-[18px] sm:text-[28px] md:text-[34px] text-primary glow-green mt-1">
                SPEED AND INSIGHT.
              </span>
            </h1>

            {/* Subhead Description */}
            <p className="font-retro text-base sm:text-xl text-muted leading-relaxed max-w-2xl">
              Precision Business Intelligence workbench analyzing{' '}
              <span className="text-foreground font-semibold">16,322 verified titles</span>,{' '}
              <span className="text-foreground font-semibold">31 hardware platforms</span>, and{' '}
              <span className="text-foreground font-semibold">8,820.01 Million</span> global unit sales from the 8-bit golden age to the HD console boom.
            </p>

            {/* Action Row: Search input + CTA Button (Brex email capture style) */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-2 p-1.5 border-2 border-card-border bg-card/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="> Search title, platform (PS4, NES), publisher..."
                    className="w-full h-11 pl-9 pr-3 bg-transparent text-foreground font-retro text-base sm:text-lg placeholder:text-muted/60 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="pixel-btn h-11 px-5 border-primary bg-primary text-background font-pixel text-[8px] sm:text-[9px] hover:bg-primary/90 flex items-center justify-center gap-1.5 transition-colors tracking-wider flex-shrink-0 cursor-pointer"
                >
                  <span>EXPLORE DATA</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Secondary Actions & Links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 font-retro text-sm sm:text-base">
              <button
                type="button"
                onClick={onOpenDataNotes}
                className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 hover:underline transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>See Data Governance & Notes</span>
              </button>
              
              <button
                type="button"
                onClick={onScrollToDashboard}
                className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition-colors cursor-pointer"
              >
                <ArrowDown className="w-4 h-4" />
                <span>Jump straight to charts & tables</span>
              </button>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="px-2.5 py-1 border border-card-border bg-card font-retro text-xs sm:text-sm text-muted">
                Sales: <span className="text-primary font-bold">8,820.01M</span>
              </div>
              <div className="px-2.5 py-1 border border-card-border bg-card font-retro text-xs sm:text-sm text-muted">
                Titles: <span className="text-secondary font-bold">16,322</span>
              </div>
              <div className="px-2.5 py-1 border border-card-border bg-card font-retro text-xs sm:text-sm text-muted">
                Platforms: <span className="text-accent font-bold">31 Active</span>
              </div>
              <div className="px-2.5 py-1 border border-card-border bg-card font-retro text-xs sm:text-sm text-muted">
                Eras: <span className="text-rose font-bold">1980–2016</span>
              </div>
            </div>

          </div>

          {/* Right Column: Arcade Cabinet (Mesin Dingdong) (~45% width) */}
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
