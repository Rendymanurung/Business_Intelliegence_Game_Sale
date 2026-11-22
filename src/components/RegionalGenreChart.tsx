'use client';

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts';
import { GenreRegionalData } from '@/types/vgsales';
import ChartCard from './ChartCard';
import { formatNumber } from '@/lib/aggregations';

const REGION_COLORS = {
  NA: '#00ff88',
  EU: '#00ccff',
  JP: '#ffd700',
  Other: '#ff3366',
};

interface RegionalGenreChartProps {
  data: GenreRegionalData[];
  activeGenre: string;
  onGenreClick: (genre: string) => void;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const regionNames: Record<string, string> = {
    NA: 'Amerika Utara (NA)', EU: 'Eropa (EU)', JP: 'Jepang (JP)', Other: 'Wilayah Lainnya',
  };
  return (
    <div className="pixel-card px-3 py-2 font-retro text-sm border-secondary">
      <p className="font-pixel text-[7px] text-secondary mb-1">{label}</p>
      {payload.map((entry, i) => {
        const key = entry.dataKey.replace('_pct', '');
        return (
          <p key={i} style={{ color: entry.color }}>
            {regionNames[key] || key}: {entry.dataKey.includes('pct') ? `${entry.value}%` : `${formatNumber(entry.value)}M`}
          </p>
        );
      })}
    </div>
  );
}

export default function RegionalGenreChart({ data, activeGenre, onGenreClick }: RegionalGenreChartProps) {
  const [mode, setMode] = useState<'absolute' | 'percent'>('absolute');

  const absKeys = ['NA', 'EU', 'JP', 'Other'] as const;
  const pctKeys = ['NA_pct', 'EU_pct', 'JP_pct', 'Other_pct'] as const;
  const dataKeys = mode === 'absolute' ? absKeys : pctKeys;
  const colorKeys = absKeys;

  return (
    <ChartCard
      title="Preferensi Genre Antarwilayah"
      subtitle={activeGenre ? `Menampilkan semua genre · Aktif: ${activeGenre} (klik untuk batal)` : 'Perbandingan NA vs EU vs JP vs Lainnya — klik batang untuk cross-filter'}
      headerRight={
        <div className="flex border-2 border-card-border overflow-hidden">
          <button
            onClick={() => setMode('absolute')}
            className={`px-2.5 py-1 font-pixel text-[7px] transition-colors tracking-wider ${mode === 'absolute' ? 'bg-primary text-background' : 'bg-card text-muted hover:text-foreground'}`}
          >
            PENJUALAN
          </button>
          <button
            onClick={() => setMode('percent')}
            className={`px-2.5 py-1 font-pixel text-[7px] transition-colors tracking-wider ${mode === 'percent' ? 'bg-primary text-background' : 'bg-card text-muted hover:text-foreground'}`}
          >
            PANGSA %
          </button>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          onClick={(state) => {
            if (state?.activeLabel) onGenreClick(state.activeLabel as string);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e40" />
          <XAxis
            dataKey="genre"
            tick={{ fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' }}
            tickLine={false}
            axisLine={{ stroke: '#2d2b5a' }}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => mode === 'absolute' ? `${v}M` : `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 255, 170, 0.08)' }} />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-vt323)' }}
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                NA: 'Amerika Utara (NA)', EU: 'Eropa (EU)', JP: 'Jepang (JP)', Other: 'Wilayah Lainnya',
                NA_pct: 'Amerika Utara (NA)', EU_pct: 'Eropa (EU)', JP_pct: 'Jepang (JP)', Other_pct: 'Wilayah Lainnya',
              };
              return labels[value] || value;
            }}
          />
          {dataKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={REGION_COLORS[colorKeys[i]]}
              cursor="pointer"
              maxBarSize={44}
            >
              {data.map((entry) => {
                const isSelected = activeGenre === entry.genre;
                const isAnySelected = Boolean(activeGenre);
                return (
                  <Cell
                    key={entry.genre}
                    fillOpacity={isAnySelected ? (isSelected ? 1 : 0.25) : 0.95}
                    stroke={isSelected ? '#ffffff' : 'transparent'}
                    strokeWidth={isSelected ? 1.5 : 0}
                  />
                );
              })}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
