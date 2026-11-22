'use client';

import React, { useMemo } from 'react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { YearlyData } from '@/types/vgsales';
import ChartCard from './ChartCard';
import { formatNumber } from '@/lib/aggregations';

interface IndustryLifecycleChartProps {
  data: YearlyData[];
  regionLabel: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: number }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="pixel-card px-3 py-2 font-retro text-sm border-secondary">
      <p className="font-pixel text-[7px] text-secondary mb-1">TAHUN: {label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-foreground/90">
          {entry.dataKey === 'totalSales'
            ? <><span className="text-primary">►</span> Penjualan: {formatNumber(entry.value)}M kopi</>
            : <><span className="text-accent">►</span> Rilis Game: {entry.value.toLocaleString('id-ID')} judul</>}
        </p>
      ))}
    </div>
  );
}

export default function IndustryLifecycleChart({ data, regionLabel }: IndustryLifecycleChartProps) {
  const peakYear = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((max, d) => d.totalSales > max.totalSales ? d : max, data[0]);
  }, [data]);

  return (
    <ChartCard
      title="Siklus Hidup Industri & Tren Rilis Game"
      subtitle={`Penjualan ${regionLabel} (area) vs jumlah rilis game (garis) · 1980–2016`}
    >
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e40" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' }}
            tickLine={false}
            axisLine={{ stroke: '#2d2b5a' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}M`}
            label={{ value: 'Penjualan (Juta)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#a09bbe' }, offset: 10 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: '#a09bbe', fontFamily: 'var(--font-vt323)' }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Jumlah Rilis', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: '#a09bbe' }, offset: 10 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 255, 170, 0.35)', strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="totalSales"
            stroke="#00ff88"
            fill="#00ff8818"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="releases"
            stroke="#ffd700"
            strokeWidth={2}
            dot={false}
          />
          {peakYear && (
            <ReferenceLine
              yAxisId="left"
              x={peakYear.year}
              stroke="#00ccff"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `⚡ Puncak: ${formatNumber(peakYear.totalSales)}M (${peakYear.year})`,
                position: 'top',
                style: { fontSize: 10, fill: '#00ccff', fontWeight: 600 },
              }}
            />
          )}
          {data.some(d => d.year === 2011) && (
            <ReferenceLine
              yAxisId="left"
              x={2011}
              stroke="#ff3366"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{
                value: '⚠ Penurunan pasca-2011',
                position: 'insideTopRight',
                style: { fontSize: 9, fill: '#ff3366' },
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
