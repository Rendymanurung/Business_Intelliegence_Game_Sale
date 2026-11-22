export interface VGSalesRecord {
  Rank: number;
  Name: string;
  Platform: string;
  Year: number;
  Genre: string;
  Publisher: string;
  NA_Sales: number;
  EU_Sales: number;
  JP_Sales: number;
  Other_Sales: number;
  Global_Sales: number;
  Platform_Family: string;
  Decade: string;
  Dominant_Region: string;
}

export type RegionKey = 'Global' | 'NA' | 'EU' | 'JP' | 'Other';

export interface FilterState {
  decade: string;
  yearMin: number;
  yearMax: number;
  platformFamily: string;
  platform: string;
  genre: string;
  region: RegionKey;
  searchQuery: string;
  crossFilterGenre: string;
  crossFilterPlatformFamily: string;
  crossFilterPlatform: string;
  crossFilterPublisher: string;
}

export interface YearlyData {
  year: number;
  totalSales: number;
  releases: number;
}

export interface GenreRegionalData {
  genre: string;
  NA: number;
  EU: number;
  JP: number;
  Other: number;
  total: number;
  NA_pct: number;
  EU_pct: number;
  JP_pct: number;
  Other_pct: number;
}

export interface GenreScatterData {
  genre: string;
  titles: number;
  avgSales: number;
  totalSales: number;
}

export interface PublisherData {
  name: string;
  sales: number;
  titles: number;
}

export interface PlatformData {
  name: string;
  sales: number;
  titles: number;
}

export interface KPIData {
  totalSales: number;
  globalSales: number;
  totalTitles: number;
  uniquePlatforms: number;
  uniquePublishers: number;
  meanSales: number;
  medianSales: number;
  topGenre: string;
  topGenreShare: number;
  topPublisher: string;
  topPublisherShare: number;
  regionLabel: string;
}
