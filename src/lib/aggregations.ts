import {
  VGSalesRecord,
  RegionKey,
  KPIData,
  YearlyData,
  GenreRegionalData,
  GenreScatterData,
  PublisherData,
  PlatformData,
} from '@/types/vgsales';

const REGION_LABELS: Record<RegionKey, string> = {
  Global: 'Global',
  NA: 'North America',
  EU: 'Europe',
  JP: 'Japan',
  Other: 'Rest of World',
};

export function getRegionLabel(region: RegionKey): string {
  return REGION_LABELS[region];
}

export function getSalesField(region: RegionKey): keyof VGSalesRecord {
  switch (region) {
    case 'NA': return 'NA_Sales';
    case 'EU': return 'EU_Sales';
    case 'JP': return 'JP_Sales';
    case 'Other': return 'Other_Sales';
    default: return 'Global_Sales';
  }
}

function getRegionSales(record: VGSalesRecord, region: RegionKey): number {
  switch (region) {
    case 'NA': return record.NA_Sales;
    case 'EU': return record.EU_Sales;
    case 'JP': return record.JP_Sales;
    case 'Other': return record.Other_Sales;
    default: return record.Global_Sales;
  }
}

export function computeKPIs(data: VGSalesRecord[], region: RegionKey): KPIData {
  if (data.length === 0) {
    return {
      totalSales: 0,
      globalSales: 0,
      totalTitles: 0,
      uniquePlatforms: 0,
      uniquePublishers: 0,
      meanSales: 0,
      medianSales: 0,
      topGenre: 'N/A',
      topGenreShare: 0,
      topPublisher: 'N/A',
      topPublisherShare: 0,
      regionLabel: getRegionLabel(region),
    };
  }

  const totalSales = data.reduce((sum, r) => sum + getRegionSales(r, region), 0);
  const globalSales = data.reduce((sum, r) => sum + r.Global_Sales, 0);
  const platforms = new Set(data.map(r => r.Platform));
  const publishers = new Set(data.map(r => r.Publisher));

  const salesArr = data.map(r => getRegionSales(r, region)).sort((a, b) => a - b);
  const mean = totalSales / data.length;
  const mid = Math.floor(salesArr.length / 2);
  const median = salesArr.length % 2 !== 0
    ? salesArr[mid]
    : (salesArr[mid - 1] + salesArr[mid]) / 2;

  const genreSales = new Map<string, number>();
  const pubSales = new Map<string, number>();
  for (const r of data) {
    const s = getRegionSales(r, region);
    genreSales.set(r.Genre, (genreSales.get(r.Genre) || 0) + s);
    pubSales.set(r.Publisher, (pubSales.get(r.Publisher) || 0) + s);
  }

  let topGenre = 'N/A';
  let topGenreSales = 0;
  for (const [g, s] of genreSales) {
    if (s > topGenreSales) { topGenre = g; topGenreSales = s; }
  }

  let topPublisher = 'N/A';
  let topPubSales = 0;
  for (const [p, s] of pubSales) {
    if (s > topPubSales) { topPublisher = p; topPubSales = s; }
  }

  return {
    totalSales,
    globalSales,
    totalTitles: data.length,
    uniquePlatforms: platforms.size,
    uniquePublishers: publishers.size,
    meanSales: mean,
    medianSales: median,
    topGenre,
    topGenreShare: totalSales > 0 ? (topGenreSales / totalSales) * 100 : 0,
    topPublisher,
    topPublisherShare: totalSales > 0 ? (topPubSales / totalSales) * 100 : 0,
    regionLabel: getRegionLabel(region),
  };
}

export function computeYearlyData(data: VGSalesRecord[], region: RegionKey): YearlyData[] {
  const map = new Map<number, { sales: number; count: number }>();
  for (const r of data) {
    const entry = map.get(r.Year) || { sales: 0, count: 0 };
    entry.sales += getRegionSales(r, region);
    entry.count += 1;
    map.set(r.Year, entry);
  }
  return Array.from(map.entries())
    .map(([year, { sales, count }]) => ({
      year,
      totalSales: parseFloat(sales.toFixed(2)),
      releases: count,
    }))
    .sort((a, b) => a.year - b.year);
}

export function computeGenreRegionalData(data: VGSalesRecord[]): GenreRegionalData[] {
  const map = new Map<string, { NA: number; EU: number; JP: number; Other: number }>();
  for (const r of data) {
    const entry = map.get(r.Genre) || { NA: 0, EU: 0, JP: 0, Other: 0 };
    entry.NA += r.NA_Sales;
    entry.EU += r.EU_Sales;
    entry.JP += r.JP_Sales;
    entry.Other += r.Other_Sales;
    map.set(r.Genre, entry);
  }
  return Array.from(map.entries())
    .map(([genre, { NA, EU, JP, Other }]) => {
      const total = NA + EU + JP + Other;
      return {
        genre,
        NA: parseFloat(NA.toFixed(2)),
        EU: parseFloat(EU.toFixed(2)),
        JP: parseFloat(JP.toFixed(2)),
        Other: parseFloat(Other.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        NA_pct: total > 0 ? parseFloat(((NA / total) * 100).toFixed(1)) : 0,
        EU_pct: total > 0 ? parseFloat(((EU / total) * 100).toFixed(1)) : 0,
        JP_pct: total > 0 ? parseFloat(((JP / total) * 100).toFixed(1)) : 0,
        Other_pct: total > 0 ? parseFloat(((Other / total) * 100).toFixed(1)) : 0,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export function computeGenreScatterData(data: VGSalesRecord[], region: RegionKey): GenreScatterData[] {
  const map = new Map<string, { sales: number; count: number }>();
  for (const r of data) {
    const entry = map.get(r.Genre) || { sales: 0, count: 0 };
    entry.sales += getRegionSales(r, region);
    entry.count += 1;
    map.set(r.Genre, entry);
  }
  return Array.from(map.entries())
    .map(([genre, { sales, count }]) => ({
      genre,
      titles: count,
      avgSales: parseFloat((sales / count).toFixed(4)),
      totalSales: parseFloat(sales.toFixed(2)),
    }))
    .sort((a, b) => b.totalSales - a.totalSales);
}

export function computeTopPublishers(
  data: VGSalesRecord[],
  region: RegionKey,
  limit: number = 10
): { publishers: PublisherData[]; top5Share: number; top10Share: number; totalSales: number } {
  const map = new Map<string, { sales: number; count: number }>();
  let totalSales = 0;
  for (const r of data) {
    const s = getRegionSales(r, region);
    totalSales += s;
    const entry = map.get(r.Publisher) || { sales: 0, count: 0 };
    entry.sales += s;
    entry.count += 1;
    map.set(r.Publisher, entry);
  }
  const sorted = Array.from(map.entries())
    .map(([name, { sales, count }]) => ({
      name,
      sales: parseFloat(sales.toFixed(2)),
      titles: count,
    }))
    .sort((a, b) => b.sales - a.sales);

  const top5Sales = sorted.slice(0, 5).reduce((s, p) => s + p.sales, 0);
  const top10Sales = sorted.slice(0, Math.min(10, sorted.length)).reduce((s, p) => s + p.sales, 0);

  return {
    publishers: sorted.slice(0, limit),
    top5Share: totalSales > 0 ? parseFloat(((top5Sales / totalSales) * 100).toFixed(1)) : 0,
    top10Share: totalSales > 0 ? parseFloat(((top10Sales / totalSales) * 100).toFixed(1)) : 0,
    totalSales: parseFloat(totalSales.toFixed(2)),
  };
}

export function computePlatformFamilyData(data: VGSalesRecord[], region: RegionKey): PlatformData[] {
  const map = new Map<string, { sales: number; count: number }>();
  for (const r of data) {
    const entry = map.get(r.Platform_Family) || { sales: 0, count: 0 };
    entry.sales += getRegionSales(r, region);
    entry.count += 1;
    map.set(r.Platform_Family, entry);
  }
  return Array.from(map.entries())
    .map(([name, { sales, count }]) => ({
      name,
      sales: parseFloat(sales.toFixed(2)),
      titles: count,
    }))
    .sort((a, b) => b.sales - a.sales);
}

export function computeTopPlatforms(data: VGSalesRecord[], region: RegionKey, limit: number = 10): PlatformData[] {
  const map = new Map<string, { sales: number; count: number }>();
  for (const r of data) {
    const entry = map.get(r.Platform) || { sales: 0, count: 0 };
    entry.sales += getRegionSales(r, region);
    entry.count += 1;
    map.set(r.Platform, entry);
  }
  return Array.from(map.entries())
    .map(([name, { sales, count }]) => ({
      name,
      sales: parseFloat(sales.toFixed(2)),
      titles: count,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit);
}

export function formatNumber(n: number, decimals: number = 2): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatInt(n: number): string {
  return n.toLocaleString('en-US');
}
