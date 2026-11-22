'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FilterState, RegionKey } from '@/types/vgsales';

const DECADES = ['All', '1980s', '1990s', '2000s', '2010s'];
const PLATFORM_FAMILIES = ['All', 'Sony', 'Nintendo', 'Microsoft', 'PC', 'Sega', 'Other'];
const PLATFORMS_BY_FAMILY: Record<string, string[]> = {
  All: [
    'All', 'NES', 'SNES', 'N64', 'GC', 'Wii', 'WiiU', 'GB', 'GBA', 'DS', '3DS',
    'PS', 'PS2', 'PS3', 'PS4', 'PSP', 'PSV',
    'XB', 'X360', 'XOne',
    'PC',
    'GEN', 'SAT', 'DC', '2600',
  ],
  Nintendo: ['All', 'NES', 'SNES', 'N64', 'GC', 'Wii', 'WiiU', 'GB', 'GBA', 'DS', '3DS'],
  Sony: ['All', 'PS', 'PS2', 'PS3', 'PS4', 'PSP', 'PSV'],
  Microsoft: ['All', 'XB', 'X360', 'XOne'],
  PC: ['All', 'PC'],
  Sega: ['All', 'GEN', 'SAT', 'DC', 'GG', 'SCD'],
  Other: ['All', '2600', '3DO', 'TG16', 'NG', 'WS', 'PCFX'],
};
const GENRES = [
  'All', 'Action', 'Adventure', 'Fighting', 'Misc', 'Platform', 'Puzzle',
  'Racing', 'Role-Playing', 'Shooter', 'Simulation', 'Sports', 'Strategy',
];
const REGIONS: { value: RegionKey; label: string }[] = [
  { value: 'Global', label: 'Global' },
  { value: 'NA', label: 'North America (NA)' },
  { value: 'EU', label: 'Europe (EU)' },
  { value: 'JP', label: 'Japan (JP)' },
  { value: 'Other', label: 'Other' },
];

interface FilterBarProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  activeFilterChips: { label: string; key: keyof FilterState; value: string }[];
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
  glowClass,
}: {
  label: string;
  value: string;
  options: string[] | { value: string; label: string }[];
  onChange: (v: string) => void;
  glowClass?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`font-pixel text-[7px] text-muted uppercase tracking-widest ${glowClass || ''}`}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-8 pl-2.5 pr-7 border-2 border-card-border bg-card text-foreground font-retro text-base focus:outline-none focus:border-primary focus:shadow-[0_0_8px_#00ff8830] transition-all appearance-none cursor-pointer"
        style={{
          borderRadius: 0,
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2300ff88' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.3rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25em 1.25em',
        }}
      >
        {options.map(opt => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
}

export default function FilterBar({ filters, updateFilter, resetFilters, activeFilterChips }: FilterBarProps) {
  return (
    <div className="bg-background-alt border-b-2 border-card-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-pixel text-[7px] text-secondary tracking-widest">▸ FILTERS</span>
          <div className="flex-1 h-[1px] bg-card-border" />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <SelectFilter
            label="Decade"
            value={filters.decade}
            options={DECADES}
            onChange={v => updateFilter('decade', v)}
          />

          <div className="flex flex-col gap-1">
            <label className="font-pixel text-[7px] text-muted uppercase tracking-widest">
              Year: <span className="text-accent">{filters.yearMin}</span>–<span className="text-accent">{filters.yearMax}</span>
            </label>
            <div className="flex items-center gap-2 h-8">
              <input
                type="range"
                min={1980}
                max={2016}
                value={filters.yearMin}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  if (v <= filters.yearMax) updateFilter('yearMin', v);
                }}
                className="w-20 sm:w-28"
              />
              <input
                type="range"
                min={1980}
                max={2016}
                value={filters.yearMax}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  if (v >= filters.yearMin) updateFilter('yearMax', v);
                }}
                className="w-20 sm:w-28"
              />
            </div>
          </div>

          <SelectFilter
            label="Ecosystem"
            value={filters.platformFamily}
            options={PLATFORM_FAMILIES}
            onChange={v => updateFilter('platformFamily', v)}
          />

          <SelectFilter
            label="Platform"
            value={filters.platform}
            options={PLATFORMS_BY_FAMILY[filters.platformFamily] || PLATFORMS_BY_FAMILY.All}
            onChange={v => updateFilter('platform', v)}
          />

          <SelectFilter
            label="Genre"
            value={filters.genre}
            options={GENRES}
            onChange={v => updateFilter('genre', v)}
          />

          <SelectFilter
            label="Region"
            value={filters.region}
            options={REGIONS}
            onChange={v => updateFilter('region', v as RegionKey)}
          />

          {activeFilterChips.length > 0 && (
            <button
              onClick={resetFilters}
              className="pixel-btn h-8 px-3 border-rose bg-rose-light text-rose font-pixel text-[7px] hover:bg-rose/20 transition-colors tracking-wider"
            >
              ✕ RESET
            </button>
          )}
        </div>

        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="font-pixel text-[7px] text-muted mr-1 tracking-wider">ACTIVE:</span>
            {activeFilterChips.map(chip => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1 px-2 py-0.5 border border-primary/40 bg-primary-light text-primary font-retro text-sm"
              >
                {chip.label}
                <button
                  onClick={() => updateFilter(chip.key, chip.value as never)}
                  className="hover:text-rose transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
