'use client';

import React from 'react';

export interface YearRangeSliderProps {
  id?: string;
  yearMin: number;
  yearMax: number;
  minLimit?: number;
  maxLimit?: number;
  onRangeChange: (min: number, max: number) => void;
}

const PRESETS = [
  { label: '80s', min: 1980, max: 1989 },
  { label: '90s', min: 1990, max: 1999 },
  { label: '00s', min: 2000, max: 2009 },
  { label: '10s', min: 2010, max: 2016 },
];

export default function YearRangeSlider({
  id = 'year-range',
  yearMin,
  yearMax,
  minLimit = 1980,
  maxLimit = 2016,
  onRangeChange,
}: YearRangeSliderProps) {
  const range = maxLimit - minLimit;
  const leftPercent = Math.max(0, Math.min(100, ((yearMin - minLimit) / range) * 100));
  const rightPercent = Math.max(0, Math.min(100, ((yearMax - minLimit) / range) * 100));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val <= yearMax) {
      onRangeChange(val, yearMax);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= yearMin) {
      onRangeChange(yearMin, val);
    }
  };

  const handlePresetClick = (pMin: number, pMax: number) => {
    if (yearMin === pMin && yearMax === pMax) {
      onRangeChange(minLimit, maxLimit);
    } else {
      onRangeChange(pMin, pMax);
    }
  };

  return (
    <div className="filter-field-group">
      <label htmlFor={`${id}-min`} className="filter-label">
        TAHUN: {yearMin}–{yearMax}
      </label>
      <div className="filter-slider-control">
        <div className="filter-track-container">
          <div className="filter-track-base" />
          <div
            className="filter-track-active"
            style={{
              left: `${leftPercent}%`,
              width: `${Math.max(0, rightPercent - leftPercent)}%`,
            }}
          />
          <input
            type="range"
            id={`${id}-min`}
            min={minLimit}
            max={maxLimit}
            value={yearMin}
            onChange={handleMinChange}
            className="filter-range-input"
            style={{ zIndex: yearMin > maxLimit - 10 ? 3 : 2 }}
            aria-label="Tahun minimum"
          />
          <input
            type="range"
            id={`${id}-max`}
            min={minLimit}
            max={maxLimit}
            value={yearMax}
            onChange={handleMaxChange}
            className="filter-range-input"
            style={{ zIndex: 2 }}
            aria-label="Tahun maksimum"
          />
        </div>

        <div className="filter-preset-group">
          {PRESETS.map((p) => {
            const isSelected = yearMin === p.min && yearMax === p.max;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePresetClick(p.min, p.max)}
                className={`filter-preset-btn ${isSelected ? 'filter-preset-active' : ''}`}
                title={`Pilih rentang ${p.min}–${p.max}`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
