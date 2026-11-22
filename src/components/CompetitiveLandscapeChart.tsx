'use client';

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { PublisherData, PlatformData } from '@/types/vgsales';
import ChartCard from './ChartCard';
import { formatNumber } from '@/lib/aggregations';

type TabKey = 'publishers' | 'platformFamily' | 'platforms';

interface CompetitiveLandscapeChartProps {
  publishers: PublisherData[];
  top5Share: number;
  top10Share: number;
  platformFamilies: PlatformData[];
  topPlatforms: PlatformData[];
  activePlatformFamily: string;
  onPlatformFamilyClick: (pf: string) => void;
  activePlatform?: string;
  onPlatformClick?: (platform: string) => void;
  regionLabel: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; sales: number; titles: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="pixel-card px-3 py-2 font-retro text-sm border-neon-purple">
      <p className="font-pixel text-[7px] text-neon-purple mb-1">{d.name}</p>
      <p className="text-foreground/90"><span className="text-primary">►</span> Penjualan: {formatNumber(d.sales)}M kopi</p>
      <p className="text-foreground/90"><span className="text-accent">►</span> Judul Game: {d.titles.toLocaleString('id-ID')}</p>
    </div>
  );
}

export default function CompetitiveLandscapeChart({
  publishers, top5Share, top10Share,
  platformFamilies, topPlatforms,
  activePlatformFamily, onPlatformFamilyClick,
  activePlatform, onPlatformClick,
  regionLabel,
}: CompetitiveLandscapeChartProps) {
  const [tab, setTab] = useState<TabKey>('publishers');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'publishers', label: 'PENERBIT' },
    { key: 'platformFamily', label: 'EKOSISTEM' },
    { key: 'platforms', label: 'PLATFORM' },
  ];

  const currentData = tab === 'publishers' ? publishers
    : tab === 'platformFamily' ? platformFamilies
    : topPlatforms;

  const subtitle = tab === 'publishers'
    ? `${regionLabel} · 5 Teratas: ${top5Share}% · 10 Teratas: ${top10Share}% (Pareto)`
    : tab === 'platformFamily'
    ? (activePlatformFamily ? `${regionLabel} · Aktif: ${activePlatformFamily} (klik untuk batal)` : `${regionLabel} · Klik batang untuk cross-filter berdasarkan ekosistem`)
    : (activePlatform ? `${regionLabel} · Aktif: ${activePlatform} (klik untuk batal)` : `${regionLabel} · Kinerja platform perangkat keras (klik untuk cross-filter)`);

  const barColor = tab === 'publishers' ? '#c678dd'
    : tab === 'platformFamily' ? '#00ccff'
    : '#ffd700';

  return (
    <ChartCard
      title="Peta Persaingan Pasar"
      subtitle={subtitle}
      headerRight={
        <div className="flex border-2 border-card-border overflow-hidden">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-2 py-1 font-pixel text-[6px] transition-colors tracking-wider ${
                tab === t.key ? 'bg-neon-purple text-background' : 'bg-card text-muted hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={currentData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
          onClick={(state) => {
            if (tab === 'platformFamily' && state?.activeLabel) {
              onPlatformFamilyClick(state.activeLabel as string);
            } else if (tab === 'platforms' && state?.activeLabel && onPlatformClick) {
              onPlatformClick(state.activeLabel as string);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e40" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' }}
            tickLine={false}
            axisLine={{ stroke: '#2d2b5a' }}
            tickFormatter={v => `${v}M`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 13, fill: '#e8e6f0', fontFamily: 'var(--font-vt323)' }}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 255, 170, 0.08)' }} />
          <Bar dataKey="sales" radius={[0, 0, 0, 0]} maxBarSize={44} cursor={tab === 'platformFamily' || tab === 'platforms' ? 'pointer' : 'default'}>
            {currentData.map((entry) => {
              const isEcosystemTab = tab === 'platformFamily';
              const isPlatformTab = tab === 'platforms';
              const isSelected = (isEcosystemTab && Boolean(activePlatformFamily && activePlatformFamily === entry.name)) ||
                                 (isPlatformTab && Boolean(activePlatform && activePlatform === entry.name));
              const isAnySelected = (isEcosystemTab && Boolean(activePlatformFamily)) ||
                                    (isPlatformTab && Boolean(activePlatform));
              return (
                <Cell
                  key={entry.name}
                  fill={barColor}
                  fillOpacity={isAnySelected ? (isSelected ? 1 : 0.25) : 0.85}
                  stroke={isSelected ? '#ffffff' : 'transparent'}
                  strokeWidth={isSelected ? 1.5 : 0}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
