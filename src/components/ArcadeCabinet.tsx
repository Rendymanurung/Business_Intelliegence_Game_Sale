'use client';

import React from 'react';
import Image from 'next/image';

interface ArcadeCabinetProps {
  totalSales?: string;
  totalGames?: number;
  onCoinInsert?: () => void;
}

export default function ArcadeCabinet({
  totalSales = '8,820.01M',
  totalGames = 16322,
  onCoinInsert,
}: ArcadeCabinetProps) {
  return (
    <div className="relative flex items-center justify-center select-none py-2 group">
      {/* Ambient background glow behind arcade */}
      <div className="absolute w-72 h-80 sm:w-96 sm:h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/25 transition-all duration-500" />
      <div className="absolute w-56 h-56 bg-secondary/15 rounded-full blur-2xl pointer-events-none translate-y-12 group-hover:bg-secondary/25 transition-all duration-500" />

      {/* Floating retro badge */}
      <div className="absolute -top-3 -right-2 sm:right-2 z-20 px-2.5 py-1 border-2 border-accent bg-card text-accent font-pixel text-[7px] sm:text-[8.5px] tracking-wider shadow-[0_0_12px_#ffd70040] animate-bounce">
        ★ EDISI ARCADE ★
      </div>

      {/* Realistic 3D Arcade Cabinet (Gambar Pengguna) */}
      <div
        onClick={onCoinInsert}
        className="relative cursor-pointer transition-transform duration-300 group-hover:scale-105 active:scale-95"
        title="Klik mesin dingdong untuk menjelajahi dashboard analitik"
      >
        <Image
          src="/arcade-cabinet.png"
          alt="Mesin Dingdong Arcade Klasik"
          width={417}
          height={606}
          priority
          className="w-[280px] sm:w-[340px] md:w-[370px] h-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] filter"
        />

        {/* Ambient bottom shadow reflection */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/60 blur-md rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
