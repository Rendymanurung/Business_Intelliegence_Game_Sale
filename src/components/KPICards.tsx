'use client';

import React from 'react';
import { DollarSign, Gamepad2, BarChart2, Trophy } from 'lucide-react';
import { KPIData } from '@/types/vgsales';
import { formatNumber, formatInt } from '@/lib/aggregations';

interface KPICardsProps {
  kpi: KPIData;
  regionIsGlobal: boolean;
}

export default function KPICards({ kpi, regionIsGlobal }: KPICardsProps) {
  const shareOfGlobal = kpi.globalSales > 0
    ? ((kpi.totalSales / kpi.globalSales) * 100).toFixed(1)
    : '0.0';

  const cards = [
    {
      icon: DollarSign,
      borderColor: 'border-primary',
      glowClass: 'box-glow-green',
      iconColor: 'text-primary',
      labelColor: 'text-primary',
      title: `TOTAL SALES (${kpi.regionLabel.toUpperCase()})`,
      value: `${formatNumber(kpi.totalSales)}M`,
      subtitle: regionIsGlobal
        ? 'copies sold globally'
        : `${shareOfGlobal}% of global sales`,
      valueColor: 'text-primary glow-green',
    },
    {
      icon: Gamepad2,
      borderColor: 'border-secondary',
      glowClass: 'box-glow-cyan',
      iconColor: 'text-secondary',
      labelColor: 'text-secondary',
      title: 'TITLES RELEASED',
      value: formatInt(kpi.totalTitles),
      subtitle: `${formatInt(kpi.uniquePlatforms)} platforms · ${formatInt(kpi.uniquePublishers)} publishers`,
      valueColor: 'text-secondary glow-cyan',
    },
    {
      icon: BarChart2,
      borderColor: 'border-accent',
      glowClass: 'box-glow-gold',
      iconColor: 'text-accent',
      labelColor: 'text-accent',
      title: 'MEAN vs MEDIAN',
      value: `${formatNumber(kpi.meanSales)}M / ${formatNumber(kpi.medianSales)}M`,
      subtitle: 'Right-skewed: blockbusters pull mean above median',
      valueColor: 'text-accent glow-gold',
    },
    {
      icon: Trophy,
      borderColor: 'border-rose',
      glowClass: 'box-glow-pink',
      iconColor: 'text-rose',
      labelColor: 'text-rose',
      title: 'MARKET LEADERS',
      value: kpi.topGenre,
      subtitle: `${kpi.topGenreShare.toFixed(1)}% share · Top Pub: ${kpi.topPublisher} (${kpi.topPublisherShare.toFixed(1)}%)`,
      valueColor: 'text-rose glow-pink',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`pixel-card p-4 ${card.borderColor} ${card.glowClass} hover:translate-y-[-2px] transition-transform`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 border-2 ${card.borderColor} bg-background flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <span className={`font-pixel text-[6px] ${card.labelColor} uppercase tracking-widest leading-tight`}>
                {card.title}
              </span>
            </div>
            <p className={`font-retro text-2xl font-bold ${card.valueColor} leading-tight truncate`}>
              {card.value}
            </p>
            <p className="font-retro text-sm text-muted mt-1 leading-snug">{'>'} {card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
