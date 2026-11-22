'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Browsers require muted for autoplay policy
      video.muted = true;
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Fallback if blocked
      });
    }
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = 0.5;
      setIsMuted(false);
      video.play().catch(() => {});
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* Video Background Canvas */}
      <div
        className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none select-none bg-[#090915]"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-80 transition-opacity duration-700"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Overlay to preserve contrast and retro aesthetic */}
        <div className="absolute inset-0 bg-[#0a0a18]/60 backdrop-blur-[0.5px]" />
      </div>

      {/* Floating Retro Sound Control Button */}
      <div className="fixed bottom-3 right-3 z-50">
        <button
          type="button"
          onClick={toggleSound}
          title={isMuted ? 'Nyalakan Musik Latar (BGM)' : 'Matikan Musik Latar (BGM)'}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-[#0e0e22]/90 border border-primary/50 text-primary font-pixel text-[8px] hover:bg-primary/20 hover:border-primary active:translate-y-[1px] transition-all shadow-[2px_2px_0_rgba(0,0,0,0.7)] cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-muted" />
              <span className="text-muted tracking-wider">BGM: MATI</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-primary tracking-wider glow-green">BGM: NYALA</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
