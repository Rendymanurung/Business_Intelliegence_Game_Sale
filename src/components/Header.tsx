'use client';

import React, { useState } from 'react';
import { Gamepad2, Info } from 'lucide-react';
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 border-2 border-primary bg-primary-light flex items-center justify-center box-glow-green">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="font-pixel text-[9px] sm:text-[11px] font-bold text-primary leading-tight truncate glow-green tracking-wider">
                VIDEO GAME SALES
                <span className="hidden sm:inline text-secondary ml-1">INTELLIGENCE</span>
              </h1>
              <p className="font-retro text-sm text-muted mt-0.5">
                {'>'} Showing{' '}
                <span className="font-bold text-accent">
                  {filteredCount.toLocaleString()}
                </span>
                {' '}of {totalCount.toLocaleString()} titles
                <span className="text-primary blink ml-1">█</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="pixel-btn flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 border-neon-purple bg-neon-purple-glow text-neon-purple font-pixel text-[7px] sm:text-[8px] hover:bg-neon-purple/20 transition-colors tracking-wider"
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
