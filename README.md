# Global Video Game Sales Intelligence (1980–2016)

Business Intelligence Web Dashboard for Global Video Game Sales analysis, built with Next.js (App Router), TypeScript, Tailwind CSS, Recharts, and Lucide React. Designed with a retro 1990s arcade aesthetic.

## Features

- **Executive KPI Cards**: Real-time aggregation of Global Sales, Total Titles, Active Platforms, and Leading Region.
- **Industry Lifecycle**: Multi-decade trajectory analysis from the 8-bit era to the HD console boom.
- **Regional Genre Preference**: Cross-market comparison across North America (NA), Europe (EU), Japan (JP), and Other regions.
- **Genre Competitiveness Matrix**: Scatter plot evaluating Market Volume vs. Average Yield per Title with bubble scaling.
- **Competitive Landscape**: Tabbed analysis covering Top Publishers, Platform Ecosystems, and Top Hardware Platforms.
- **Top Games Evidence Table**: Searchable, sortable tabular evidence with direct platform/ecosystem filtering and pagination.
- **Multi-dimensional Filtering**: Filter by Decade, Custom Year Range (1980–2016), Ecosystem/Platform, Genre, and Region.
- **Bidirectional Cross-filtering**: Interactive chart highlights connected to the global filter state.
- **Data Governance Documentation**: In-app modal detailing data cleaning, feature engineering, rounding variance notes, and limitations.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom 1990s retro arcade pixel theme
- **Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Press Start 2P, VT323

## Dataset Summary

- **Source**: Video Game Sales (1980–2016)
- **Cleaned Records**: 16,322 titles
- **Total Global Volume**: 8,820.01 Million copies
- **Cleaning Actions**: Standardized missing values, removed anomalous entries, engineered `Platform_Family`, `Decade`, and `Dominant_Region`.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the dashboard.

## Production Build

```bash
npm run build
npm run start
```
