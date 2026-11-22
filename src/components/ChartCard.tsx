'use client';

import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export default function ChartCard({ title, subtitle, children, headerRight }: ChartCardProps) {
  return (
    <div className="pixel-card overflow-hidden flex flex-col">
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-pixel text-[8px] text-secondary leading-relaxed tracking-wider uppercase">
            {title}
          </h3>
          {subtitle && (
            <p className="font-retro text-sm text-muted mt-0.5 leading-snug">
              {'>'} {subtitle}
            </p>
          )}
        </div>
        {headerRight && <div className="ml-3 flex-shrink-0">{headerRight}</div>}
      </div>
      <div className="mx-4 h-[1px] bg-card-border" />
      <div className="flex-1 px-2 pb-3 pt-2">
        {children}
      </div>
    </div>
  );
}
