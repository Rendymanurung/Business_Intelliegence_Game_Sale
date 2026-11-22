'use client';

import React, { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useVGSalesData } from '@/hooks/useVGSalesData';
import {
  computeKPIs,
  computeYearlyData,
  computeGenreRegionalData,
  computeGenreScatterData,
  computeTopPublishers,
  computePlatformFamilyData,
  computeTopPlatforms,
  getRegionLabel,
} from '@/lib/aggregations';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import KPICards from '@/components/KPICards';
import IndustryLifecycleChart from '@/components/IndustryLifecycleChart';
import RegionalGenreChart from '@/components/RegionalGenreChart';
import GenreScatterChart from '@/components/GenreScatterChart';
import CompetitiveLandscapeChart from '@/components/CompetitiveLandscapeChart';
import GamesTable from '@/components/GamesTable';
import EmptyState from '@/components/EmptyState';
import DataNotesModal from '@/components/DataNotesModal';

export default function DashboardPage() {
  const [showDataNotes, setShowDataNotes] = useState(false);
  const {
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
    totalRecords,
  } = useVGSalesData();

  const scrollToDashboard = () => {
    const el = document.getElementById('analytics-dashboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const region = filters.region;
  const regionLabel = getRegionLabel(region);

  const activeGenre = filters.crossFilterGenre || (filters.genre !== 'All' ? filters.genre : '');
  const activePlatformFamily = filters.crossFilterPlatformFamily || (filters.platformFamily !== 'All' ? filters.platformFamily : '');
  const activePlatform = filters.crossFilterPlatform || '';

  const handleGenreToggle = (genre: string) => {
    if (activeGenre === genre) {
      updateFilter('crossFilterGenre', '');
      if (filters.genre !== 'All') {
        updateFilter('genre', 'All');
      }
    } else {
      if (filters.genre !== 'All' && filters.genre !== genre) {
        updateFilter('genre', 'All');
      }
      updateFilter('crossFilterGenre', genre);
    }
  };

  const handlePlatformFamilyToggle = (pf: string) => {
    if (activePlatformFamily === pf) {
      updateFilter('crossFilterPlatformFamily', '');
      if (filters.platformFamily !== 'All') {
        updateFilter('platformFamily', 'All');
      }
    } else {
      if (filters.platformFamily !== 'All' && filters.platformFamily !== pf) {
        updateFilter('platformFamily', 'All');
      }
      updateFilter('crossFilterPlatformFamily', pf);
    }
  };

  const handlePlatformToggle = (platform: string) => {
    if (activePlatform === platform) {
      updateFilter('crossFilterPlatform', '');
    } else {
      updateFilter('crossFilterPlatform', platform);
    }
  };

  const handleTablePlatformFamilyClick = (family: string) => {
    if (filters.platformFamily === family) {
      updateFilter('platformFamily', 'All');
    } else {
      updateFilter('platformFamily', family);
    }
  };

  const handleTablePlatformClick = (platform: string, family: string) => {
    if (filters.platform === platform) {
      updateFilter('platform', 'All');
    } else {
      updateFilter('platformFamily', family);
      updateFilter('platform', platform);
    }
  };

  const kpi = useMemo(() => computeKPIs(filteredData, region), [filteredData, region]);
  const yearlyData = useMemo(() => computeYearlyData(filteredData, region), [filteredData, region]);
  const genreRegionalData = useMemo(() => computeGenreRegionalData(genreFilteredData), [genreFilteredData]);
  const genreScatterData = useMemo(() => computeGenreScatterData(genreFilteredData, region), [genreFilteredData, region]);
  const publisherData = useMemo(() => computeTopPublishers(filteredData, region), [filteredData, region]);
  const platformFamilyData = useMemo(() => computePlatformFamilyData(platformFilteredData, region), [platformFilteredData, region]);
  const topPlatforms = useMemo(() => computeTopPlatforms(platformFilteredData, region), [platformFilteredData, region]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-pixel text-[9px] text-primary tracking-wider">LOADING 16,322 RECORDS...</p>
        <div className="w-48 h-3 border-2 border-primary bg-background overflow-hidden">
          <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-16 h-16 border-2 border-rose bg-rose-light flex items-center justify-center box-glow-pink">
          <span className="font-pixel text-xl text-rose">!!</span>
        </div>
        <p className="font-pixel text-[9px] text-rose tracking-wider">SYSTEM ERROR</p>
        <p className="font-retro text-base text-muted max-w-md text-center">
          {'>'} Could not fetch /data/vgsales_clean.json — {error}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        filteredCount={filteredData.length}
        totalCount={totalRecords}
        onOpenDataNotes={() => setShowDataNotes(true)}
      />

      <HeroSection
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => updateFilter('searchQuery', q)}
        totalRecords={totalRecords}
        filteredCount={filteredData.length}
        onOpenDataNotes={() => setShowDataNotes(true)}
        onScrollToDashboard={scrollToDashboard}
      />

      <div id="analytics-dashboard" className="scroll-mt-24">
        <FilterBar
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          activeFilterChips={activeFilterChips}
        />
      </div>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
        {filteredData.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <>
            <KPICards kpi={kpi} regionIsGlobal={region === 'Global'} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <IndustryLifecycleChart data={yearlyData} regionLabel={regionLabel} />
              <RegionalGenreChart
                data={genreRegionalData}
                activeGenre={activeGenre}
                onGenreClick={handleGenreToggle}
              />
              <GenreScatterChart
                data={genreScatterData}
                activeGenre={activeGenre}
                onGenreClick={handleGenreToggle}
                regionLabel={regionLabel}
              />
              <CompetitiveLandscapeChart
                publishers={publisherData.publishers}
                top5Share={publisherData.top5Share}
                top10Share={publisherData.top10Share}
                platformFamilies={platformFamilyData}
                topPlatforms={topPlatforms}
                activePlatformFamily={activePlatformFamily}
                onPlatformFamilyClick={handlePlatformFamilyToggle}
                activePlatform={activePlatform}
                onPlatformClick={handlePlatformToggle}
                regionLabel={regionLabel}
              />
            </div>

            <GamesTable
              data={filteredData}
              region={region}
              searchQuery={filters.searchQuery}
              onSearchChange={(q) => updateFilter('searchQuery', q)}
              onPlatformFamilyClick={handleTablePlatformFamilyClick}
              onPlatformClick={handleTablePlatformClick}
            />
          </>
        )}

        <footer className="text-center py-6 border-t-2 border-card-border">
          <p className="font-pixel text-[7px] text-muted tracking-wider leading-relaxed">
            <span className="text-primary">■</span>{' '}
            <span className="text-secondary">■</span>{' '}
            <span className="text-accent">■</span>{' '}
            <span className="text-rose">■</span>
          </p>
          <p className="font-retro text-sm text-muted mt-2">
            {'>'} VIDEO GAME SALES BI DASHBOARD · 1980–2016 · NEXT.JS + RECHARTS + TAILWIND
          </p>
          <p className="font-pixel text-[6px] text-muted/50 mt-1 tracking-widest">
            INSERT COIN TO CONTINUE
          </p>
        </footer>
      </main>

      {showDataNotes && <DataNotesModal onClose={() => setShowDataNotes(false)} />}
    </div>
  );
}
