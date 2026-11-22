'use client';

import React from 'react';
import { KPIData } from '@/types/vgsales';
import { formatNumber, formatInt } from '@/lib/aggregations';

interface KPICardsProps {
  kpi: KPIData;
  regionIsGlobal: boolean;
}

export default function KPICards({ kpi }: KPICardsProps) {
  const cards = [
    {
      borderColor: 'border-primary',
      glowClass: 'box-glow-green',
      labelColor: 'text-primary',
      title: `TOTAL PENJUALAN (${kpi.regionLabel.toUpperCase()})`,
      value: `${formatNumber(kpi.totalSales)}M`,
      valueColor: 'text-primary glow-green',
    },
    {
      borderColor: 'border-secondary',
      glowClass: 'box-glow-cyan',
      labelColor: 'text-secondary',
      title: 'TOTAL GAME DIRILIS',
      value: formatInt(kpi.totalTitles),
      valueColor: 'text-secondary glow-cyan',
    },
    {
      borderColor: 'border-accent',
      glowClass: 'box-glow-gold',
      labelColor: 'text-accent',
      title: 'RATA-RATA vs MEDIAN',
      value: `${formatNumber(kpi.meanSales)}M / ${formatNumber(kpi.medianSales)}M`,
      valueColor: 'text-accent glow-gold',
    },
    {
      borderColor: 'border-rose',
      glowClass: 'box-glow-pink',
      labelColor: 'text-rose',
      title: 'PEMIMPIN PASAR',
      value: kpi.topGenre,
      valueColor: 'text-rose glow-pink',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`pixel-card p-4 sm:p-5 ${card.borderColor} ${card.glowClass} text-center flex flex-col items-center justify-center min-h-[105px] hover:translate-y-[-2px] transition-transform`}
        >
          <span className={`font-pixel text-[8.5px] sm:text-[10px] font-bold ${card.labelColor} uppercase tracking-wider leading-snug mb-2`}>
            {card.title}
          </span>
          <p className={`font-retro text-2xl sm:text-3xl font-bold ${card.valueColor} leading-tight truncate`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
