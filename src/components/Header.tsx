'use client';

import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import DataNotesModal from './DataNotesModal';

interface HeaderProps {
  filteredCount: number;
  totalCount: number;
  onOpenDataNotes?: () => void;
}

export default function Header({ filteredCount, totalCount, onOpenDataNotes }: HeaderProps) {
  const [internalModal, setInternalModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenModal = () => {
    if (onOpenDataNotes) {
      onOpenDataNotes();
    } else {
      setInternalModal(true);
    }
  };

  return (
    <>
      {/* Floating luxury transparent navbar (Louis Vuitton style) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0c0c1d]/90 backdrop-blur-md border-b-2 border-card-border shadow-lg shadow-black/50'
            : 'bg-transparent border-b-2 border-transparent shadow-none'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 min-h-[76px]">
          <div className="flex-1 flex justify-start min-w-0">
            <p className="font-retro text-base sm:text-lg text-muted truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {'>'} Menampilkan{' '}
              <span className="font-bold text-accent">
                {filteredCount.toLocaleString()}
              </span>
              {' '}dari {totalCount.toLocaleString()} judul game
            </p>
          </div>

          <div className="text-center flex-shrink-0 px-3">
            <h1 className="font-pixel font-bold leading-tight tracking-wider">
              <span className="text-[11px] sm:text-[15px] text-primary glow-green block drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                PENJUALAN VIDEO GAME
              </span>
              <span className="text-[9px] sm:text-[11px] text-secondary tracking-widest block mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                KRISTAL
              </span>
            </h1>
          </div>

          <div className="flex-1 flex justify-end min-w-0">
            <button
              onClick={handleOpenModal}
              className="pixel-btn inline-flex items-center gap-1.5 px-3.5 py-2 border-neon-purple bg-neon-purple-glow text-neon-purple font-pixel text-[7.5px] sm:text-[8.5px] hover:bg-neon-purple/20 transition-colors tracking-wider cursor-pointer shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">CATATAN DATA</span>
              <span className="sm:hidden">INFO</span>
            </button>
          </div>
        </div>
        <div
          className={`h-[2px] bg-gradient-to-r from-primary via-secondary to-rose transition-opacity duration-300 ${
            isScrolled ? 'opacity-60' : 'opacity-0'
          }`}
        />
      </header>
      {internalModal && <DataNotesModal onClose={() => setInternalModal(false)} />}
    </>
  );
}
