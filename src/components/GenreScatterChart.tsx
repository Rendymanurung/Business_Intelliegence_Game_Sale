'use client';

import React, { useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, ZAxis, Cell,
} from 'recharts';
import { GenreScatterData } from '@/types/vgsales';
import ChartCard from './ChartCard';
import { formatNumber } from '@/lib/aggregations';

const GENRE_COLORS: Record<string, string> = {
  Action: '#00ff88', Sports: '#00ccff', Shooter: '#ff3366', 'Role-Playing': '#ffd700',
  Misc: '#c678dd', Racing: '#00e5ff', Platform: '#ff69b4', Fighting: '#40ffce',
  Simulation: '#ff8c00', Puzzle: '#8888ff', Adventure: '#aaff00', Strategy: '#e040fb',
};

interface GenreScatterChartProps {
  data: GenreScatterData[];
  activeGenre: string;
  onGenreClick: (genre: string) => void;
  regionLabel: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: GenreScatterData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="pixel-card px-3 py-2 font-retro text-sm border-accent">
      <p className="font-pixel text-[7px] text-accent mb-1">{d.genre}</p>
      <p className="text-foreground/90"><span className="text-primary">►</span> Titles: {d.titles.toLocaleString()}</p>
      <p className="text-foreground/90"><span className="text-secondary">►</span> Avg Sales: {formatNumber(d.avgSales)}M</p>
      <p className="text-foreground/90"><span className="text-accent">►</span> Total: {formatNumber(d.totalSales)}M</p>
    </div>
  );
}

export default function GenreScatterChart({ data, activeGenre, onGenreClick, regionLabel }: GenreScatterChartProps) {
  const { avgTitles, avgSalesPerTitle } = useMemo(() => {
    if (data.length === 0) return { avgTitles: 0, avgSalesPerTitle: 0 };
    const totalT = data.reduce((s, d) => s + d.titles, 0);
    const totalAvg = data.reduce((s, d) => s + d.avgSales, 0);
    return {
      avgTitles: totalT / data.length,
      avgSalesPerTitle: totalAvg / data.length,
    };
  }, [data]);

  const maxBubble = useMemo(() => {
    return data.length > 0 ? Math.max(...data.map(d => d.totalSales)) : 1;
  }, [data]);

  return (
    <ChartCard
      title="Genre Competitiveness: Volume vs Efficiency"
      subtitle={activeGenre ? `${regionLabel} · Active: ${activeGenre} (click to toggle off)` : `${regionLabel} — Bubble size = total sales. Click to cross-filter.`}
    >
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 28, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e40" />
          <XAxis
            type="number"
            dataKey="titles"
            name="Titles"
            tick={{ fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' }}
            tickLine={false}
            axisLine={{ stroke: '#2d2b5a' }}
            label={{ value: 'Number of Titles', position: 'insideBottom', offset: -2, style: { fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' } }}
          />
          <YAxis
            type="number"
            dataKey="avgSales"
            name="Avg Sales"
            tick={{ fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}M`}
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15 * 100) / 100]}
            label={{ value: 'Avg Sales/Title (M)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' }, offset: 10 }}
          />
          <ZAxis type="number" dataKey="totalSales" range={[200, 2000]} domain={[0, maxBubble]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(0, 255, 170, 0.4)' }} />
          <ReferenceLine
            x={avgTitles} stroke="#7a78a0" strokeDasharray="4 4" strokeWidth={1}
            label={{ value: 'Avg Volume', position: 'top', style: { fontSize: 10, fill: '#a09bbe' } }}
          />
          <ReferenceLine
            y={avgSalesPerTitle} stroke="#7a78a0" strokeDasharray="4 4" strokeWidth={1}
            label={{ value: 'Avg Efficiency', position: 'right', style: { fontSize: 10, fill: '#a09bbe' } }}
          />
          <Scatter
            data={data}
            cursor="pointer"
            onClick={(entry: unknown) => {
              const d = entry as GenreScatterData | undefined;
              if (d?.genre) onGenreClick(d.genre);
            }}
          >
            {data.map((entry) => {
              const isSelected = activeGenre === entry.genre;
              const isAnySelected = Boolean(activeGenre);
              return (
                <Cell
                  key={entry.genre}
                  fill={GENRE_COLORS[entry.genre] || '#7a78a0'}
                  fillOpacity={isAnySelected ? (isSelected ? 1 : 0.25) : 0.85}
                  stroke={isSelected ? '#ffffff' : 'transparent'}
                  strokeWidth={isSelected ? 2 : 0}
                />
              );
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 px-2 mt-1">
        {data.map(d => {
          const isSelected = activeGenre === d.genre;
          return (
            <button
              key={d.genre}
              onClick={() => onGenreClick(d.genre)}
              className={`inline-flex items-center gap-1 font-retro text-xs px-1.5 py-0.5 border transition-all ${
                isSelected ? 'border-primary text-primary glow-green bg-primary-light' : 'border-card-border/60 hover:border-foreground'
              } ${activeGenre && !isSelected ? 'opacity-35' : ''}`}
            >
              <span className="w-2 h-2 inline-block" style={{ background: GENRE_COLORS[d.genre] || '#7a78a0' }} />
              {d.genre}
            </button>
          );
        })}
      </div>
    </ChartCard>
  );
}
