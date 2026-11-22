'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import DataNotesModal from './DataNotesModal';

interface HeaderProps {
  filteredCount: number;
  totalCount: number;
}

export default function Header({ filteredCount, totalCount }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b-2 border-card-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 relative flex items-center justify-center">
          <div className="text-center min-w-0 px-14 sm:px-28">
            <h1 className="font-pixel font-bold leading-tight tracking-wider">
              <span className="text-[10px] sm:text-[13px] text-primary glow-green block">
                VIDEO GAME SALES
              </span>
              <span className="text-[8px] sm:text-[10px] text-secondary tracking-widest block mt-0.5">
                KRISTAL
              </span>
            </h1>
            <p className="font-retro text-sm sm:text-base text-muted mt-0.5">
              {'>'} Showing{' '}
              <span className="font-bold text-accent">
                {filteredCount.toLocaleString()}
              </span>
              {' '}of {totalCount.toLocaleString()} titles
              <span className="text-primary blink ml-1">█</span>
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="pixel-btn absolute right-4 sm:right-6 inline-flex items-center gap-1.5 px-3 py-1.5 border-neon-purple bg-neon-purple-glow text-neon-purple font-pixel text-[7px] sm:text-[8px] hover:bg-neon-purple/20 transition-colors tracking-wider"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DATA NOTES</span>
            <span className="sm:hidden">INFO</span>
          </button>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-primary via-secondary to-rose opacity-60" />
      </header>
      {showModal && <DataNotesModal onClose={() => setShowModal(false)} />}
    </>
  );
}
