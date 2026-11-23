'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

export interface TeamMember {
  id: string;
  name: string;
  nim: string;
  avatar: string;
  color: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '01',
    name: 'Rendy Manurung',
    nim: '241401090',
    avatar: '/team/rendy-manurung.jpg',
    color: '#00ff88',
  },
  {
    id: '02',
    name: 'Affan Apyga',
    nim: '241401141',
    avatar: '/team/member2.jpg',
    color: '#00ccff',
  },
  {
    id: '03',
    name: 'Deryal Rasky',
    nim: '241401120',
    avatar: '/team/member3.jpg',
    color: '#ffd700',
  },
  {
    id: '04',
    name: 'Deofajar Situmorang',
    nim: '241401102',
    avatar: '/team/member4.jpg',
    color: '#ff3366',
  },
  {
    id: '05',
    name: 'Michael Garcia',
    nim: '241401069',
    avatar: '/team/michael-garcia.jpg',
    color: '#c678dd',
  },
];

export default function TeamSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(2);

  const stateRef = useRef({
    phase: 2,
    target: 2,
    base: 2,
    pointerX: 0,
    pointerY: 0,
    active: false,
    lastInput: typeof performance !== 'undefined' ? performance.now() : 0,
  });

  const count = TEAM_MEMBERS.length;

  const wrappedDelta = useCallback(
    (index: number, phase: number) => {
      let delta = index - phase;
      while (delta > count / 2) delta -= count;
      while (delta < -count / 2) delta += count;
      return delta;
    },
    [count]
  );

  const nearestIndex = useCallback(() => {
    return ((Math.round(stateRef.current.phase) % count) + count) % count;
  }, [count]);

  const moveTo = useCallback(
    (index: number) => {
      const current = nearestIndex();
      let delta = index - current;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      stateRef.current.base += delta;
      stateRef.current.target = stateRef.current.base;
      stateRef.current.active = false;
      stateRef.current.lastInput = performance.now();
      setActiveIdx(index);
    },
    [count, nearestIndex]
  );

  useEffect(() => {
    let animationFrameId: number;
    let previousTime = performance.now();
    const stage = stageRef.current;
    if (!stage) return;

    const cards = cardRefs.current;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = (time: number) => {
      const state = stateRef.current;
      const deltaTime = Math.min(32, time - previousTime);
      previousTime = time;
      const ease = reducedMotion ? 1 : 1 - Math.pow(0.001, deltaTime / 1000);

      // Gentle idle animation when not interacting
      if (!state.active && time - state.lastInput > 3200) {
        const idle = time - state.lastInput - 3200;
        state.target = state.base + Math.sin(idle * 0.00045) * 1.8;
      }

      state.phase += (state.target - state.phase) * ease;
      const isCompact = window.innerWidth < 768;
      const currentActive = nearestIndex();
      setActiveIdx(currentActive);

      const horizontalSpacing = Math.min(220, Math.max(140, window.innerWidth * 0.14));
      const verticalSpacing = Math.min(130, Math.max(88, window.innerHeight * 0.11));

      cards.forEach((card, index) => {
        if (!card) return;
        const delta = wrappedDelta(index, state.phase);
        const distance = Math.abs(delta);
        const focus = Math.exp(-distance * distance * 1.35);
        const side = Math.max(0, 1 - distance / 4.5);
        const direction = Math.sign(delta);

        const x = isCompact
          ? delta * 28 + Math.sin(delta * 0.9) * 22
          : delta * horizontalSpacing;
        const y = isCompact
          ? delta * verticalSpacing
          : distance * 12 + state.pointerY * focus * 8;
        const z = focus * 170 - distance * 155;
        const scale = 0.62 + side * 0.12 + focus * 0.45;
        const rotateX = isCompact ? delta * 2.1 : -state.pointerY * focus * 3.5;
        const rotateY = isCompact
          ? -delta * 4
          : -direction * (distance > 0.2 ? 15 + Math.min(distance, 3) * 5 : 0) +
            state.pointerX * focus * 3;
        const rotateZ = isCompact ? delta * -1.2 : delta * 0.6;

        card.style.setProperty('--focus', focus.toFixed(4));
        card.style.zIndex = String(Math.round(1000 - distance * 100));
        card.style.opacity = String(Math.max(0.2, side * 0.72 + focus * 0.28));
        card.style.filter = `blur(${Math.max(0, distance - 1.4) * 0.35}px)`;
        card.style.transform = [
          'translate(-50%, -50%)',
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px)`,
          `rotateX(${rotateX.toFixed(2)}deg)`,
          `rotateY(${rotateY.toFixed(2)}deg)`,
          `rotateZ(${rotateZ.toFixed(2)}deg)`,
          `scale(${scale.toFixed(4)})`,
        ].join(' ');
        card.setAttribute('aria-current', index === currentActive ? 'true' : 'false');
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      const state = stateRef.current;
      state.pointerX = nx;
      state.pointerY = ny;
      state.active = true;
      state.target = state.base + (window.innerWidth < 768 ? ny * 2.0 : nx * 2.8);
      state.lastInput = performance.now();
      stage.style.setProperty('--pointer-x', `${(nx + 1) * 50}%`);
    };

    const handlePointerLeave = () => {
      const state = stateRef.current;
      state.active = false;
      state.pointerX = 0;
      state.pointerY = 0;
      state.target = state.base;
      stage.style.setProperty('--pointer-x', '50%');
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const direction = Math.sign(Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX);
      if (!direction) return;
      const state = stateRef.current;
      state.base += direction;
      state.target = state.base;
      state.active = false;
      state.lastInput = performance.now();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
      const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
      if (!forward && !backward) return;
      event.preventDefault();
      const state = stateRef.current;
      state.base += forward ? 1 : -1;
      state.target = state.base;
      state.active = false;
      state.lastInput = performance.now();
    };

    stage.addEventListener('pointermove', handlePointerMove);
    stage.addEventListener('pointerleave', handlePointerLeave);
    stage.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      stage.removeEventListener('pointermove', handlePointerMove);
      stage.removeEventListener('pointerleave', handlePointerLeave);
      stage.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [count, nearestIndex, wrappedDelta]);

  return (
    <section
      id="tim-pengembang"
      className="relative bg-[#0c0c1d] border-b-2 border-card-border pt-36 sm:pt-48 pb-24 sm:pb-32 overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.06),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(45,43,90,0.08)_1px,transparent_1px)] bg-[size:60px_100%]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <h2 className="font-pixel text-[18px] sm:text-[24px] md:text-[28px] text-foreground tracking-tight leading-snug inline-flex items-center justify-center flex-wrap">
            <span className="mr-8 sm:mr-14">TIM PENGEMBANG</span>
            <span className="text-primary glow-green">KRISTAL</span>
          </h2>
        </div>

        {/* 3D Character Carousel Stage */}
        <div
          ref={stageRef}
          className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] overflow-hidden rounded-none border-2 border-card-border bg-[#0d0d24] touch-none cursor-ew-resize"
          style={{
            perspective: '1450px',
            transformStyle: 'preserve-3d',
            backgroundImage: `
              radial-gradient(circle at var(--pointer-x, 50%) 50%, rgba(0, 255, 136, 0.08), transparent 45%),
              linear-gradient(90deg, rgba(58, 58, 106, 0.15) 1px, transparent 1px),
              repeating-linear-gradient(0deg, transparent 0, transparent 79px, rgba(58, 58, 106, 0.12) 80px, transparent 81px)
            `,
            backgroundSize: '100% 100%, 80px 100%, 100% 80px',
          }}
          aria-label="Carousel 3D Interaktif Anggota Tim"
        >
          {/* Subtle side vignettes */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#0d0d24] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#0d0d24] to-transparent z-20 pointer-events-none" />


          {/* 3D Deck container */}
          <div
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {TEAM_MEMBERS.map((member, idx) => (
              <button
                key={member.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => moveTo(idx)}
                aria-label={`Pilih profil ${member.name}, NIM ${member.nim}`}
                className="group absolute top-1/2 left-1/2 w-[165px] sm:w-[210px] md:w-[235px] aspect-[0.72] p-2 text-left cursor-pointer rounded-none border-2 transition-shadow duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{
                  transformStyle: 'preserve-3d',
                  backgroundColor: '#161630',
                  borderColor: idx === activeIdx ? member.color : '#2d2b5a',
                  boxShadow:
                    idx === activeIdx
                      ? `0 14px 36px rgba(0,0,0,0.6), 0 0 20px ${member.color}35`
                      : '0 8px 24px rgba(0,0,0,0.5)',
                }}
              >
                {/* Photo frame */}
                <div className="relative w-full h-[74%] overflow-hidden bg-[#10102a] border border-[#2d2b5a]">
                  <Image
                    src={member.avatar}
                    alt={`Foto profil ${member.name}`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 210px, 240px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={idx < 3}
                  />
                  {/* Subtle color overlay */}
                  <div
                    className="absolute inset-0 opacity-15 mix-blend-color"
                    style={{ backgroundColor: member.color }}
                  />
                </div>

                {/* Footer meta: Nama (tulisan putih) dan NIM (dibawahnya), tanpa icon nomor */}
                <div className="relative h-[26%] flex flex-col justify-center px-3 bg-[#10102a] border-t border-[#2d2b5a] mt-1.5 overflow-hidden">
                  <p className="font-pixel text-[8px] sm:text-[9.5px] text-white font-bold tracking-tight truncate uppercase leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {member.name}
                  </p>
                  <p
                    className="font-retro text-sm sm:text-base font-semibold truncate leading-none mt-1 tracking-wider"
                    style={{ color: member.color }}
                  >
                    NIM: {member.nim}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Quick carousel navigation dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {TEAM_MEMBERS.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => moveTo(idx)}
                aria-label={`Buka slide ${m.name}`}
                className="w-3 h-3 transition-all duration-200 border"
                style={{
                  backgroundColor: idx === activeIdx ? m.color : 'transparent',
                  borderColor: m.color,
                  transform: idx === activeIdx ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
