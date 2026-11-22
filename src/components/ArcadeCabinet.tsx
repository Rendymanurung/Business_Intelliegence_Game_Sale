'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

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
  const [credits, setCredits] = useState(1);
  const [coinInserted, setCoinInserted] = useState(false);
  const [screenFrame, setScreenFrame] = useState(0);

  // Retro animation frame for CRT screen
  useEffect(() => {
    const timer = setInterval(() => {
      setScreenFrame(prev => (prev + 1) % 4);
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const handleCoinClick = () => {
    setCredits(c => c + 1);
    setCoinInserted(true);
    if (onCoinInsert) onCoinInsert();
    setTimeout(() => setCoinInserted(false), 800);
  };

  return (
    <div className="relative flex items-center justify-center select-none py-2">
      {/* Ambient background glow behind arcade */}
      <div className="absolute w-72 h-80 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-56 h-56 bg-secondary/10 rounded-full blur-2xl pointer-events-none translate-y-12" />

      {/* Floating retro badge */}
      <div className="absolute -top-3 -right-2 sm:right-4 z-20 px-2.5 py-1 border-2 border-accent bg-card text-accent font-pixel text-[7px] sm:text-[8.5px] tracking-wider shadow-[0_0_12px_#ffd70040] animate-bounce">
        ★ EDISI ARCADE ★
      </div>

      {/* Main Arcade Cabinet Body */}
      <div className="relative w-[300px] sm:w-[360px] bg-[#0a0a16] border-4 border-[#1e1d3b] rounded-t-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,255,136,0.15)] overflow-hidden">
        
        {/* Top Marquee Header */}
        <div className="relative bg-gradient-to-b from-[#15142e] to-[#0d0c1f] px-4 py-3 border-b-4 border-[#1e1d3b]">
          <div className="flex items-center justify-between border-2 border-primary/50 bg-[#070614] px-3 py-1.5 shadow-[inset_0_0_12px_rgba(0,255,136,0.3)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose animate-ping" />
              <span className="font-pixel text-[8px] sm:text-[9px] text-primary tracking-widest font-bold glow-green">
                KRISTAL ARCADE
              </span>
            </div>
            <span className="font-pixel text-[7px] text-accent tracking-widest">
              1980–2016
            </span>
          </div>
          {/* Marquee backlighting bar */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* CRT Bezel & Screen Section */}
        <div className="p-4 sm:p-5 bg-[#080716] border-b-4 border-[#1e1d3b]">
          {/* Inner Bezel */}
          <div className="relative p-3 bg-[#111026] border-2 border-[#2a284e] rounded-lg shadow-inner">
            
            {/* The CRT Screen itself */}
            <div className="relative h-44 sm:h-52 bg-[#04040a] border-2 border-[#1c1b33] rounded overflow-hidden flex flex-col justify-between p-3 font-pixel">
              
              {/* Scanline CRT overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-10 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 2px)',
                }}
              />
              {/* CRT screen corner vignette */}
              <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]" />

              {/* CRT Header: High Score */}
              <div className="relative z-10 flex items-center justify-between text-[7px] sm:text-[8px] border-b border-card-border/40 pb-1">
                <span className="text-rose">1UP <span className="text-foreground">{totalGames.toLocaleString('id-ID')}</span></span>
                <span className="text-accent">SKOR TERTINGGI: {totalSales}</span>
              </div>

              {/* CRT Center: Animated Mini Game / Retro Analytics Display */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center my-1">
                {/* Pixel Chart / Graphic Animation */}
                <div className="flex items-end gap-1.5 h-14 mb-2">
                  <div className="w-3 bg-primary transition-all duration-300" style={{ height: screenFrame === 0 ? '60%' : '85%' }} />
                  <div className="w-3 bg-secondary transition-all duration-300" style={{ height: screenFrame === 1 ? '90%' : '50%' }} />
                  <div className="w-3 bg-accent transition-all duration-300" style={{ height: screenFrame === 2 ? '75%' : '95%' }} />
                  <div className="w-3 bg-rose transition-all duration-300" style={{ height: screenFrame === 3 ? '100%' : '70%' }} />
                  <div className="w-3 bg-neon-purple transition-all duration-300" style={{ height: screenFrame === 0 ? '45%' : '80%' }} />
                </div>

                <p className="text-[8px] sm:text-[9px] text-primary tracking-widest glow-green font-bold">
                  INTELIJEN PENJUALAN BI
                </p>
                <p className="font-retro text-xs text-muted mt-0.5">
                  MASUKKAN KOIN UNTUK ANALITIK LENGKAP
                </p>
              </div>

              {/* CRT Footer: Credits & Blinking Start */}
              <div className="relative z-10 flex items-center justify-between text-[6.5px] sm:text-[7.5px] border-t border-card-border/40 pt-1 text-muted">
                <span className="text-secondary">KREDIT {String(credits).padStart(2, '0')}</span>
                <span className="text-primary animate-pulse">
                  {coinInserted ? '★ PEMAIN 1 SIAP ★' : '▶ TEKAN START ◀'}
                </span>
              </div>
            </div>

            {/* CRT Glass Reflection highlight */}
            <div className="absolute top-4 left-4 w-20 h-32 bg-gradient-to-br from-white/5 to-transparent rounded pointer-events-none" />
          </div>
        </div>

        {/* Control Panel (Slanted deck with Joystick & Buttons) */}
        <div className="bg-[#121124] p-3.5 sm:p-4 border-b-4 border-[#1e1d3b] shadow-inner">
          <div className="flex items-center justify-between px-2">
            
            {/* Joystick */}
            <div className="relative flex flex-col items-center group cursor-pointer">
              {/* Ball top */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-rose via-rose/90 to-red-900 border border-rose/50 shadow-[0_4px_8px_rgba(0,0,0,0.6),0_0_12px_#ff336660] group-hover:-translate-y-0.5 group-hover:scale-105 transition-transform" />
              {/* Shaft */}
              <div className="w-2 h-4 sm:h-5 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 shadow-sm" />
              {/* Base washer */}
              <div className="w-8 h-2.5 bg-black rounded-full border border-gray-700 shadow-md" />
              <span className="font-pixel text-[5.5px] text-muted mt-1 tracking-wider">JOYSTICK</span>
            </div>

            {/* 1P / 2P Start buttons */}
            <div className="flex flex-col gap-1.5 items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCoinClick}
                  className="w-4 h-4 rounded-full bg-white/90 border border-gray-400 shadow active:translate-y-0.5 hover:bg-white transition-all flex items-center justify-center font-pixel text-[5px] text-black"
                  title="1 Player Start"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={handleCoinClick}
                  className="w-4 h-4 rounded-full bg-white/90 border border-gray-400 shadow active:translate-y-0.5 hover:bg-white transition-all flex items-center justify-center font-pixel text-[5px] text-black"
                  title="2 Player Start"
                >
                  2
                </button>
              </div>
              <span className="font-pixel text-[5px] text-muted tracking-wider">START</span>
            </div>

            {/* Arcade Buttons Grid (2 rows of 3 buttons) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCoinClick}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose border border-rose/60 shadow-[0_2px_4px_rgba(0,0,0,0.5),0_0_6px_#ff336640] active:scale-90 hover:brightness-125 transition-transform"
                  title="Button A"
                />
                <button
                  type="button"
                  onClick={handleCoinClick}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary border border-primary/60 shadow-[0_2px_4px_rgba(0,0,0,0.5),0_0_6px_#00ff8840] active:scale-90 hover:brightness-125 transition-transform"
                  title="Button B"
                />
                <button
                  type="button"
                  onClick={handleCoinClick}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-secondary border border-secondary/60 shadow-[0_2px_4px_rgba(0,0,0,0.5),0_0_6px_#00ccff40] active:scale-90 hover:brightness-125 transition-transform"
                  title="Button C"
                />
              </div>
              <div className="flex gap-2 translate-x-1">
                <button
                  type="button"
                  onClick={handleCoinClick}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-accent border border-accent/60 shadow-[0_2px_4px_rgba(0,0,0,0.5),0_0_6px_#ffd70040] active:scale-90 hover:brightness-125 transition-transform"
                  title="Button D"
                />
                <button
                  type="button"
                  onClick={handleCoinClick}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-neon-purple border border-neon-purple/60 shadow-[0_2px_4px_rgba(0,0,0,0.5),0_0_6px_#b026ff40] active:scale-90 hover:brightness-125 transition-transform"
                  title="Button E"
                />
                <button
                  type="button"
                  onClick={handleCoinClick}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/80 border border-white/60 shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:scale-90 hover:brightness-125 transition-transform"
                  title="Button F"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lower Cabinet & Coin Door Section */}
        <div className="bg-[#090817] px-6 py-4 flex items-center justify-between">
          {/* Speaker Grille slits */}
          <div className="flex flex-col gap-1 w-16">
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
          </div>

          {/* Dual Coin Slots / Reject Doors */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCoinClick}
              className={`group flex flex-col items-center justify-center w-12 h-14 bg-[#18172c] border-2 ${
                coinInserted ? 'border-primary shadow-[0_0_10px_#00ff88]' : 'border-[#2d2b52]'
              } rounded hover:border-accent transition-all cursor-pointer`}
              title="Click to Insert Coin (25¢)"
            >
              {/* Coin Slot slit */}
              <div className="w-6 h-1 bg-black rounded border-b border-gray-700 mb-1" />
              {/* Backlit Reject Button */}
              <div className="w-7 h-5 bg-gradient-to-b from-orange-500 to-amber-700 border border-orange-400 rounded flex items-center justify-center shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] group-hover:brightness-125">
                <span className="font-pixel text-[5px] text-white font-bold">25¢</span>
              </div>
              <span className="font-pixel text-[4.5px] text-muted mt-0.5">MASUKKAN</span>
            </button>

            <button
              type="button"
              onClick={handleCoinClick}
              className="group flex flex-col items-center justify-center w-12 h-14 bg-[#18172c] border-2 border-[#2d2b52] rounded hover:border-accent transition-all cursor-pointer"
              title="Klik untuk Masukkan Koin (25¢)"
            >
              <div className="w-6 h-1 bg-black rounded border-b border-gray-700 mb-1" />
              <div className="w-7 h-5 bg-gradient-to-b from-orange-500 to-amber-700 border border-orange-400 rounded flex items-center justify-center shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] group-hover:brightness-125">
                <span className="font-pixel text-[5px] text-white font-bold">25¢</span>
              </div>
              <span className="font-pixel text-[4.5px] text-muted mt-0.5">MASUKKAN</span>
            </button>
          </div>

          {/* Right Speaker Grille slits */}
          <div className="flex flex-col gap-1 w-16">
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
            <div className="h-0.5 bg-black rounded shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
          </div>
        </div>

        {/* Machine Base Footer */}
        <div className="h-3 bg-[#05040d] border-t border-[#1e1d3b]" />
      </div>
    </div>
  );
}
