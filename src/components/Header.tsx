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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 flex justify-start min-w-0">
            <p className="font-retro text-sm sm:text-base text-muted truncate">
              {'>'} Showing{' '}
              <span className="font-bold text-accent">
                {filteredCount.toLocaleString()}
              </span>
              {' '}of {totalCount.toLocaleString()} titles
            </p>
          </div>

          <div className="text-center flex-shrink-0 px-2">
            <h1 className="font-pixel font-bold leading-tight tracking-wider">
              <span className="text-[10px] sm:text-[13px] text-primary glow-green block">
                VIDEO GAME SALES
              </span>
              <span className="text-[8px] sm:text-[10px] text-secondary tracking-widest block mt-0.5">
                KRISTAL
              </span>
            </h1>
          </div>

          <div className="flex-1 flex justify-end min-w-0">
            <button
              onClick={() => setShowModal(true)}
              className="pixel-btn inline-flex items-center gap-1.5 px-3 py-1.5 border-neon-purple bg-neon-purple-glow text-neon-purple font-pixel text-[7px] sm:text-[8px] hover:bg-neon-purple/20 transition-colors tracking-wider"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DATA NOTES</span>
              <span className="sm:hidden">INFO</span>
            </button>
          </div>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-primary via-secondary to-rose opacity-60" />
      </header>
      {showModal && <DataNotesModal onClose={() => setShowModal(false)} />}
    </>
  );
}
