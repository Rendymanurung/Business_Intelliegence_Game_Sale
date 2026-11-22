'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { VGSalesRecord, RegionKey } from '@/types/vgsales';
import { formatNumber } from '@/lib/aggregations';

type SortKey = 'Rank' | 'Year' | 'Global_Sales' | 'NA_Sales' | 'EU_Sales' | 'JP_Sales' | 'Other_Sales';

interface GamesTableProps {
  data: VGSalesRecord[];
  region: RegionKey;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPlatformFamilyClick: (family: string) => void;
  onPlatformClick: (platform: string, family: string) => void;
}

const PLATFORM_FAMILY_COLORS: Record<string, string> = {
  Sony: 'border-secondary text-secondary bg-secondary-light',
  Nintendo: 'border-rose text-rose bg-rose-light',
  Microsoft: 'border-primary text-primary bg-primary-light',
  PC: 'border-neon-purple text-neon-purple bg-neon-purple-glow',
  Sega: 'border-accent text-accent bg-accent-light',
  Other: 'border-muted text-muted bg-card',
};

const ROWS_PER_PAGE = 15;

export default function GamesTable({ data, region, searchQuery, onSearchChange, onPlatformFamilyClick, onPlatformClick }: GamesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>(region === 'Global' ? 'Global_Sales' : `${region}_Sales` as SortKey);
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortKey] as number;
      const bVal = b[sortKey] as number;
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [data, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageData = sortedData.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
    setPage(0);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 text-muted/40" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  const columns: { key: SortKey; label: string; align: string }[] = [
    { key: 'Rank', label: '#', align: 'text-center' },
    { key: 'Year', label: 'Year', align: 'text-center' },
    { key: 'Global_Sales', label: 'Global', align: 'text-right' },
    { key: 'NA_Sales', label: 'NA', align: 'text-right' },
    { key: 'EU_Sales', label: 'EU', align: 'text-right' },
    { key: 'JP_Sales', label: 'JP', align: 'text-right' },
    { key: 'Other_Sales', label: 'Other', align: 'text-right' },
  ];

  return (
    <div className="pixel-card overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-pixel text-[8px] text-accent tracking-wider">▸ TOP GAMES EVIDENCE TABLE</h3>
          <p className="font-retro text-sm text-muted mt-0.5">
            {'>'} {sortedData.length.toLocaleString()} games · Sorted by {columns.find(c => c.key === sortKey)?.label} ({sortAsc ? '▲ asc' : '▼ desc'})
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="text"
            placeholder="> search title, platform (e.g. PS4), publisher, genre..."
            value={searchQuery}
            onChange={e => { onSearchChange(e.target.value); setPage(0); }}
            className="h-8 pl-8 pr-3 w-full sm:w-80 border-2 border-card-border bg-background text-foreground font-retro text-base placeholder:text-muted/50 focus:outline-none focus:border-primary focus:shadow-[0_0_8px_#00ff8830] transition-all"
            style={{ borderRadius: 0 }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full font-retro text-sm">
          <thead>
            <tr className="bg-background-alt border-y-2 border-card-border">
              {columns.slice(0, 1).map(col => (
                <th
                  key={col.key}
                  className={`px-3 py-2 font-pixel text-[7px] text-muted cursor-pointer hover:text-primary transition-colors ${col.align} w-12 tracking-wider`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-0.5">
                    {col.label} <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
              <th className="px-3 py-2 font-pixel text-[7px] text-muted text-left tracking-wider">TITLE</th>
              <th className="px-3 py-2 font-pixel text-[7px] text-muted text-left w-20 tracking-wider">PLAT</th>
              <th className="px-3 py-2 font-pixel text-[7px] text-muted text-left w-24 tracking-wider">GENRE</th>
              <th className="px-3 py-2 font-pixel text-[7px] text-muted text-left w-28 tracking-wider">PUBLISHER</th>
              {columns.slice(1).map(col => (
                <th
                  key={col.key}
                  className={`px-3 py-2 font-pixel text-[7px] text-muted cursor-pointer hover:text-primary transition-colors ${col.align} w-16 tracking-wider`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-0.5 justify-end">
                    {col.label} <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-10 text-muted font-retro text-base">
                  {'>'} No games match your current filters and search.
                </td>
              </tr>
            ) : (
              pageData.map((game, i) => (
                <tr
                  key={`${game.Rank}-${game.Name}-${game.Platform}-${i}`}
                  className="border-b border-card-border/50 hover:bg-primary-light transition-colors"
                >
                  <td className="px-3 py-1.5 text-center text-muted font-mono text-xs">{game.Rank}</td>
                  <td className="px-3 py-1.5 text-left text-foreground max-w-[200px] truncate" title={game.Name}>
                    {game.Name}
                  </td>
                  <td className="px-3 py-1.5 text-left">
                    <span className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPlatformFamilyClick(game.Platform_Family)}
                        className={`inline-block px-1.5 py-0.5 border text-[10px] font-pixel tracking-wider hover:opacity-80 transition-opacity cursor-pointer ${PLATFORM_FAMILY_COLORS[game.Platform_Family] || PLATFORM_FAMILY_COLORS.Other}`}
                        title={`Filter by ${game.Platform_Family}`}
                      >
                        {game.Platform_Family.slice(0, 4).toUpperCase()}
                      </button>
                      <button
                        type="button"
                        onClick={() => onPlatformClick(game.Platform, game.Platform_Family)}
                        className="text-muted text-xs hover:text-primary hover:underline transition-colors cursor-pointer font-mono"
                        title={`Filter by ${game.Platform}`}
                      >
                        {game.Platform}
                      </button>
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-left text-muted">{game.Genre}</td>
                  <td className="px-3 py-1.5 text-left text-muted truncate max-w-[120px]" title={game.Publisher}>{game.Publisher}</td>
                  <td className="px-3 py-1.5 text-center text-muted">{game.Year}</td>
                  <td className="px-3 py-1.5 text-right text-foreground">{formatNumber(game.Global_Sales)}</td>
                  <td className={`px-3 py-1.5 text-right ${region === 'NA' ? 'text-primary glow-green' : 'text-muted'}`}>{formatNumber(game.NA_Sales)}</td>
                  <td className={`px-3 py-1.5 text-right ${region === 'EU' ? 'text-secondary glow-cyan' : 'text-muted'}`}>{formatNumber(game.EU_Sales)}</td>
                  <td className={`px-3 py-1.5 text-right ${region === 'JP' ? 'text-accent glow-gold' : 'text-muted'}`}>{formatNumber(game.JP_Sales)}</td>
                  <td className={`px-3 py-1.5 text-right ${region === 'Other' ? 'text-rose glow-pink' : 'text-muted'}`}>{formatNumber(game.Other_Sales)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-3 flex items-center justify-between border-t-2 border-card-border">
          <p className="font-retro text-sm text-muted">
            PAGE {currentPage + 1} OF {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="w-7 h-7 border border-card-border flex items-center justify-center text-muted hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = idx;
              } else if (currentPage < 3) {
                pageNum = idx;
              } else if (currentPage > totalPages - 4) {
                pageNum = totalPages - 5 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 border font-retro text-sm transition-colors ${
                    currentPage === pageNum
                      ? 'border-primary bg-primary text-background'
                      : 'border-card-border text-muted hover:text-foreground hover:border-foreground'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="w-7 h-7 border border-card-border flex items-center justify-center text-muted hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
