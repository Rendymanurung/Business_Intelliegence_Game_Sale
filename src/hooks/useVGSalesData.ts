'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { VGSalesRecord, FilterState, RegionKey } from '@/types/vgsales';

const DEFAULT_FILTERS: FilterState = {
  decade: 'All',
  yearMin: 1980,
  yearMax: 2016,
  platformFamily: 'All',
  platform: 'All',
  genre: 'All',
  region: 'Global',
  searchQuery: '',
  crossFilterGenre: '',
  crossFilterPlatformFamily: '',
  crossFilterPlatform: '',
  crossFilterPublisher: '',
};

function matchesSearch(r: VGSalesRecord, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  if (!q) return true;

  // 1. Exact platform match (e.g. typing "nes" matches NES only, not SNES)
  if (r.Platform.toLowerCase() === q) return true;

  // 2. Exact platform family match (e.g. "sony", "nintendo")
  if (r.Platform_Family.toLowerCase() === q) return true;

  // 3. Exact genre match
  if (r.Genre.toLowerCase() === q) return true;

  // 4. Word boundary / prefix match on Name or Publisher
  // (Prevents "nes" from matching words like "Jones", "Genesis", "Fitness", "Darkness")
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordRegex = new RegExp('(^|\\b)' + escaped, 'i');

  if (wordRegex.test(r.Name) || wordRegex.test(r.Publisher)) {
    return true;
  }

  // 5. For search queries 4+ characters, allow title/publisher substring if not a platform code
  if (q.length >= 4 && (r.Name.toLowerCase().includes(q) || r.Publisher.toLowerCase().includes(q))) {
    return true;
  }

  return false;
}

export function useVGSalesData() {
  const [rawData, setRawData] = useState<VGSalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    fetch('/data/vgsales_clean.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: VGSalesRecord[]) => {
        setRawData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    return rawData.filter(r => {
      if (filters.decade !== 'All' && r.Decade !== filters.decade) return false;
      if (r.Year < filters.yearMin || r.Year > filters.yearMax) return false;
      if (filters.platformFamily !== 'All' && r.Platform_Family !== filters.platformFamily) return false;
      if (filters.platform !== 'All' && r.Platform !== filters.platform) return false;
      if (filters.genre !== 'All' && r.Genre !== filters.genre) return false;
      if (filters.crossFilterGenre && r.Genre !== filters.crossFilterGenre) return false;
      if (filters.crossFilterPlatformFamily && r.Platform_Family !== filters.crossFilterPlatformFamily) return false;
      if (filters.crossFilterPlatform && r.Platform !== filters.crossFilterPlatform) return false;
      if (filters.crossFilterPublisher && r.Publisher !== filters.crossFilterPublisher) return false;
      if (!matchesSearch(r, filters.searchQuery)) return false;
      return true;
    });
  }, [rawData, filters]);

  // Sliced data for Genre charts: ignores genre & crossFilterGenre so all genres remain visible
  const genreFilteredData = useMemo(() => {
    return rawData.filter(r => {
      if (filters.decade !== 'All' && r.Decade !== filters.decade) return false;
      if (r.Year < filters.yearMin || r.Year > filters.yearMax) return false;
      if (filters.platformFamily !== 'All' && r.Platform_Family !== filters.platformFamily) return false;
      if (filters.platform !== 'All' && r.Platform !== filters.platform) return false;
      if (filters.crossFilterPlatformFamily && r.Platform_Family !== filters.crossFilterPlatformFamily) return false;
      if (filters.crossFilterPlatform && r.Platform !== filters.crossFilterPlatform) return false;
      if (filters.crossFilterPublisher && r.Publisher !== filters.crossFilterPublisher) return false;
      if (!matchesSearch(r, filters.searchQuery)) return false;
      return true;
    });
  }, [rawData, filters]);

  // Sliced data for Platform charts: ignores platformFamily & crossFilterPlatformFamily so all ecosystems remain visible
  const platformFilteredData = useMemo(() => {
    return rawData.filter(r => {
      if (filters.decade !== 'All' && r.Decade !== filters.decade) return false;
      if (r.Year < filters.yearMin || r.Year > filters.yearMax) return false;
      if (filters.genre !== 'All' && r.Genre !== filters.genre) return false;
      if (filters.crossFilterGenre && r.Genre !== filters.crossFilterGenre) return false;
      if (filters.crossFilterPublisher && r.Publisher !== filters.crossFilterPublisher) return false;
      if (!matchesSearch(r, filters.searchQuery)) return false;
      return true;
    });
  }, [rawData, filters]);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'decade') {
        if (value === 'All') {
          next.yearMin = 1980;
          next.yearMax = 2016;
        } else {
          const decadeStart = parseInt(value as string);
          next.yearMin = Math.max(decadeStart, 1980);
          next.yearMax = Math.min(decadeStart + 9, 2016);
        }
      }
      if (key === 'platformFamily') {
        next.platform = 'All';
      }
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleCrossFilter = useCallback((key: 'crossFilterGenre' | 'crossFilterPlatformFamily' | 'crossFilterPlatform' | 'crossFilterPublisher', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  }, []);

  const activeFilterChips = useMemo(() => {
    const chips: { label: string; key: keyof FilterState; value: string }[] = [];
    if (filters.decade !== 'All') chips.push({ label: `Decade: ${filters.decade}`, key: 'decade', value: 'All' });
    if (filters.yearMin !== 1980 || filters.yearMax !== 2016)
      chips.push({ label: `Years: ${filters.yearMin}–${filters.yearMax}`, key: 'yearMin', value: '1980' });
    if (filters.platformFamily !== 'All') chips.push({ label: `Ecosystem: ${filters.platformFamily}`, key: 'platformFamily', value: 'All' });
    if (filters.platform !== 'All') chips.push({ label: `Platform: ${filters.platform}`, key: 'platform', value: 'All' });
    if (filters.genre !== 'All') chips.push({ label: `Genre: ${filters.genre}`, key: 'genre', value: 'All' });
    if (filters.region !== 'Global') chips.push({ label: `Region: ${filters.region}`, key: 'region', value: 'Global' as RegionKey });
    if (filters.crossFilterGenre) chips.push({ label: `Genre (chart): ${filters.crossFilterGenre}`, key: 'crossFilterGenre', value: '' });
    if (filters.crossFilterPlatformFamily) chips.push({ label: `Ecosystem (chart): ${filters.crossFilterPlatformFamily}`, key: 'crossFilterPlatformFamily', value: '' });
    if (filters.crossFilterPlatform) chips.push({ label: `Platform (chart): ${filters.crossFilterPlatform}`, key: 'crossFilterPlatform', value: '' });
    if (filters.crossFilterPublisher) chips.push({ label: `Publisher (chart): ${filters.crossFilterPublisher}`, key: 'crossFilterPublisher', value: '' });
    if (filters.searchQuery) chips.push({ label: `Search: "${filters.searchQuery}"`, key: 'searchQuery', value: '' });
    return chips;
  }, [filters]);

  return {
    rawData,
    filteredData,
    genreFilteredData,
    platformFilteredData,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    toggleCrossFilter,
    activeFilterChips,
    totalRecords: rawData.length,
  };
}
