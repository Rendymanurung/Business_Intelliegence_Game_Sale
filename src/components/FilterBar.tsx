'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FilterState, RegionKey } from '@/types/vgsales';

const DECADES = [
  { value: 'All', label: 'Semua' },
  { value: '1980s', label: '1980-an' },
  { value: '1990s', label: '1990-an' },
  { value: '2000s', label: '2000-an' },
  { value: '2010s', label: '2010-an' },
];
const PLATFORM_FAMILIES = [
  { value: 'All', label: 'Semua' },
  { value: 'Sony', label: 'Sony' },
  { value: 'Nintendo', label: 'Nintendo' },
  { value: 'Microsoft', label: 'Microsoft' },
  { value: 'PC', label: 'PC' },
  { value: 'Sega', label: 'Sega' },
  { value: 'Other', label: 'Lainnya' },
];
const PLATFORMS_BY_FAMILY: Record<string, { value: string; label: string }[]> = {
  All: [
    { value: 'All', label: 'Semua' },
    { value: 'NES', label: 'NES' }, { value: 'SNES', label: 'SNES' }, { value: 'N64', label: 'N64' },
    { value: 'GC', label: 'GC' }, { value: 'Wii', label: 'Wii' }, { value: 'WiiU', label: 'WiiU' },
    { value: 'GB', label: 'GB' }, { value: 'GBA', label: 'GBA' }, { value: 'DS', label: 'DS' },
    { value: '3DS', label: '3DS' }, { value: 'PS', label: 'PS' }, { value: 'PS2', label: 'PS2' },
    { value: 'PS3', label: 'PS3' }, { value: 'PS4', label: 'PS4' }, { value: 'PSP', label: 'PSP' },
    { value: 'PSV', label: 'PSV' }, { value: 'XB', label: 'XB' }, { value: 'X360', label: 'X360' },
    { value: 'XOne', label: 'XOne' }, { value: 'PC', label: 'PC' }, { value: 'GEN', label: 'GEN' },
    { value: 'SAT', label: 'SAT' }, { value: 'DC', label: 'DC' }, { value: '2600', label: '2600' },
  ],
  Nintendo: [
    { value: 'All', label: 'Semua' },
    { value: 'NES', label: 'NES' }, { value: 'SNES', label: 'SNES' }, { value: 'N64', label: 'N64' },
    { value: 'GC', label: 'GC' }, { value: 'Wii', label: 'Wii' }, { value: 'WiiU', label: 'WiiU' },
    { value: 'GB', label: 'GB' }, { value: 'GBA', label: 'GBA' }, { value: 'DS', label: 'DS' },
    { value: '3DS', label: '3DS' },
  ],
  Sony: [
    { value: 'All', label: 'Semua' },
    { value: 'PS', label: 'PS' }, { value: 'PS2', label: 'PS2' }, { value: 'PS3', label: 'PS3' },
    { value: 'PS4', label: 'PS4' }, { value: 'PSP', label: 'PSP' }, { value: 'PSV', label: 'PSV' },
  ],
  Microsoft: [
    { value: 'All', label: 'Semua' },
    { value: 'XB', label: 'XB' }, { value: 'X360', label: 'X360' }, { value: 'XOne', label: 'XOne' },
  ],
  PC: [{ value: 'All', label: 'Semua' }, { value: 'PC', label: 'PC' }],
  Sega: [
    { value: 'All', label: 'Semua' },
    { value: 'GEN', label: 'GEN' }, { value: 'SAT', label: 'SAT' }, { value: 'DC', label: 'DC' },
    { value: 'GG', label: 'GG' }, { value: 'SCD', label: 'SCD' },
  ],
  Other: [
    { value: 'All', label: 'Semua' },
    { value: '2600', label: '2600' }, { value: '3DO', label: '3DO' }, { value: 'TG16', label: 'TG16' },
    { value: 'NG', label: 'NG' }, { value: 'WS', label: 'WS' }, { value: 'PCFX', label: 'PCFX' },
  ],
};
const GENRES = [
  { value: 'All', label: 'Semua' },
  { value: 'Action', label: 'Aksi (Action)' },
  { value: 'Adventure', label: 'Petualangan (Adventure)' },
  { value: 'Fighting', label: 'Pertarungan (Fighting)' },
  { value: 'Misc', label: 'Lain-lain (Misc)' },
  { value: 'Platform', label: 'Platformer' },
  { value: 'Puzzle', label: 'Teka-teki (Puzzle)' },
  { value: 'Racing', label: 'Balapan (Racing)' },
  { value: 'Role-Playing', label: 'Role-Playing (RPG)' },
  { value: 'Shooter', label: 'Penembak (Shooter)' },
  { value: 'Simulation', label: 'Simulasi (Simulation)' },
  { value: 'Sports', label: 'Olahraga (Sports)' },
  { value: 'Strategy', label: 'Strategi (Strategy)' },
];
const REGIONS: { value: RegionKey; label: string }[] = [
  { value: 'Global', label: 'Global' },
  { value: 'NA', label: 'Amerika Utara (NA)' },
  { value: 'EU', label: 'Eropa (EU)' },
  { value: 'JP', label: 'Jepang (JP)' },
  { value: 'Other', label: 'Wilayah Lainnya' },
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
          <span className="font-pixel text-[7px] text-secondary tracking-widest">▸ FILTER DATA</span>
          <div className="flex-1 h-[1px] bg-card-border" />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <SelectFilter
            label="Dekade"
            value={filters.decade}
            options={DECADES}
            onChange={v => updateFilter('decade', v)}
          />

          <div className="flex flex-col gap-1">
            <label className="font-pixel text-[7px] text-muted uppercase tracking-widest">
              Tahun: <span className="text-accent">{filters.yearMin}</span>–<span className="text-accent">{filters.yearMax}</span>
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
            label="Ekosistem"
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
            label="Wilayah"
            value={filters.region}
            options={REGIONS}
            onChange={v => updateFilter('region', v as RegionKey)}
          />

          {activeFilterChips.length > 0 && (
            <button
              onClick={resetFilters}
              className="pixel-btn h-8 px-3 border-rose bg-rose-light text-rose font-pixel text-[7px] hover:bg-rose/20 transition-colors tracking-wider"
            >
              ✕ ATUR ULANG
            </button>
          )}
        </div>

        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="font-pixel text-[7px] text-muted mr-1 tracking-wider">FILTER AKTIF:</span>
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
