'use client';

import React from 'react';

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  isActive?: boolean;
}

export default function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
  isActive = false,
}: FilterSelectProps) {
  return (
    <div className="filter-field-group">
      <label htmlFor={id} className="filter-label">
        {label}
      </label>
      <div className="filter-select-wrapper">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`filter-select ${isActive ? 'filter-select-active' : ''}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="filter-option">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="filter-select-arrow" aria-hidden="true">
          ▾
        </span>
      </div>
    </div>
  );
}
