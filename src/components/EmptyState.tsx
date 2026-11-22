'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 border-2 border-rose bg-rose-light flex items-center justify-center mb-4 box-glow-pink">
        <span className="font-pixel text-xl text-rose">?!</span>
      </div>
      <h3 className="font-pixel text-[10px] text-rose mb-2 tracking-wider">TIDAK ADA DATA DITEMUKAN</h3>
      <p className="font-retro text-lg text-muted mb-4 max-w-md">
        {'>'} Tidak ada data game yang cocok dengan kriteria filter Anda saat ini. Silakan sesuaikan filter atau atur ulang untuk melihat seluruh data.
      </p>
      <button
        onClick={onReset}
        className="pixel-btn inline-flex items-center gap-2 px-4 py-2 border-primary bg-primary-light text-primary font-pixel text-[8px] hover:bg-primary/20 transition-colors tracking-wider cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        ATUR ULANG SEMUA FILTER
      </button>
    </div>
  );
}
