'use client';

import React from 'react';
import { FilterState, RegionKey } from '@/types/vgsales';
import FilterSelect, { FilterSelectOption } from './FilterSelect';
import YearRangeSlider from './YearRangeSlider';
import styles from './FilterBar.module.css';

export interface FilterOptions {
  platformFamilies?: FilterSelectOption[];
  platformsByFamily?: Record<string, FilterSelectOption[]>;
  genres?: FilterSelectOption[];
  regions?: { value: RegionKey; label: string }[];
}

export interface FilterBarProps {
  filters: FilterState;
  onChange?: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  updateFilter?: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset?: () => void;
  resetFilters?: () => void;
  resultCount?: number;
  options?: FilterOptions;
  activeFilterChips?: { label: string; key: keyof FilterState; value: string }[];
}

const DEFAULT_PLATFORM_FAMILIES: FilterSelectOption[] = [
  { value: 'All', label: 'Semua' },
  { value: 'Sony', label: 'Sony' },
  { value: 'Nintendo', label: 'Nintendo' },
  { value: 'Microsoft', label: 'Microsoft' },
  { value: 'PC', label: 'PC' },
  { value: 'Sega', label: 'Sega' },
  { value: 'Other', label: 'Lainnya' },
];

const DEFAULT_PLATFORMS_BY_FAMILY: Record<string, FilterSelectOption[]> = {
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

const DEFAULT_GENRES: FilterSelectOption[] = [
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

const DEFAULT_REGIONS: { value: RegionKey; label: string }[] = [
  { value: 'Global', label: 'Global' },
  { value: 'NA', label: 'Amerika Utara (NA)' },
  { value: 'EU', label: 'Eropa (EU)' },
  { value: 'JP', label: 'Jepang (JP)' },
  { value: 'Other', label: 'Wilayah Lainnya' },
];

export default function FilterBar({
  filters,
  onChange,
  updateFilter,
  onReset,
  resetFilters,
  resultCount = 0,
  options,
}: FilterBarProps) {
  const triggerChange = onChange || updateFilter || (() => {});
  const triggerReset = onReset || resetFilters || (() => {});

  const platformFamilies = options?.platformFamilies || DEFAULT_PLATFORM_FAMILIES;
  const platformsByFamily = options?.platformsByFamily || DEFAULT_PLATFORMS_BY_FAMILY;
  const genres = options?.genres || DEFAULT_GENRES;
  const regions = options?.regions || DEFAULT_REGIONS;

  const currentPlatforms = platformsByFamily[filters.platformFamily] || platformsByFamily.All;

  const isEcosystemActive = filters.platformFamily !== 'All' && filters.platformFamily !== 'Semua';
  const isPlatformActive = filters.platform !== 'All' && filters.platform !== 'Semua';
  const isGenreActive = filters.genre !== 'All' && filters.genre !== 'Semua';
  const isRegionActive = filters.region !== 'Global';
  const isYearActive = filters.yearMin !== 1980 || filters.yearMax !== 2016;

  const isDefault =
    !isYearActive &&
    !isEcosystemActive &&
    !isPlatformActive &&
    !isGenreActive &&
    !isRegionActive &&
    !filters.searchQuery &&
    !filters.crossFilterGenre &&
    !filters.crossFilterPlatformFamily &&
    !filters.crossFilterPlatform &&
    !filters.crossFilterPublisher;

  const handleYearChange = (min: number, max: number) => {
    triggerChange('yearMin', min);
    triggerChange('yearMax', max);
    if (filters.decade !== 'All') {
      triggerChange('decade', 'All');
    }
  };

  const formattedResult = resultCount.toLocaleString('id-ID');

  return (
    <div className={styles.filterBarContainer}>
      {/* Header bar: small title with 1px border-bottom full width */}
      <div className={styles.filterHeader}>
        <div className={styles.filterHeaderInner}>
          <h2 className={styles.filterTitle}>FILTER DATA</h2>
        </div>
      </div>

      {/* Main Grid: Year (Slider), Ecosystem, Platform, Genre, Region, Actions */}
      <div className={styles.controlsWrapper}>
        <div className={styles.controlsGrid}>
          {/* 1. Tahun (Dual Thumb Slider + Presets) */}
          <YearRangeSlider
            id="filter-year"
            yearMin={filters.yearMin}
            yearMax={filters.yearMax}
            minLimit={1980}
            maxLimit={2016}
            onRangeChange={handleYearChange}
          />

          {/* 2. Ekosistem */}
          <FilterSelect
            id="filter-ecosystem"
            label="EKOSISTEM"
            value={filters.platformFamily}
            options={platformFamilies}
            onChange={(val) => {
              triggerChange('platformFamily', val);
              triggerChange('platform', 'All');
            }}
            isActive={isEcosystemActive}
          />

          {/* 3. Platform */}
          <FilterSelect
            id="filter-platform"
            label="PLATFORM"
            value={filters.platform}
            options={currentPlatforms}
            onChange={(val) => triggerChange('platform', val)}
            isActive={isPlatformActive}
          />

          {/* 4. Genre */}
          <FilterSelect
            id="filter-genre"
            label="GENRE"
            value={filters.genre}
            options={genres}
            onChange={(val) => triggerChange('genre', val)}
            isActive={isGenreActive}
          />

          {/* 5. Wilayah */}
          <FilterSelect
            id="filter-region"
            label="WILAYAH"
            value={filters.region}
            options={regions}
            onChange={(val) => triggerChange('region', val as RegionKey)}
            isActive={isRegionActive}
          />

          {/* 6. Area Aksi (Hitungan Hasil + Tombol Reset) */}
          <div className={styles.fieldGroup}>
            <span className={styles.label}>HASIL</span>
            <div className={styles.actionGroup}>
              <div className={styles.resultCount} title="Jumlah game hasil filter">
                {formattedResult} GAME
              </div>
              <button
                type="button"
                onClick={triggerReset}
                disabled={isDefault}
                className={styles.resetBtn}
                title={isDefault ? 'Semua filter dalam kondisi default' : 'Kembalikan semua filter ke kondisi awal'}
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
