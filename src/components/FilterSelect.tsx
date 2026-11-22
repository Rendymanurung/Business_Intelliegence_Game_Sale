'use client';

import React from 'react';
import styles from './FilterBar.module.css';

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
    <div className={styles.fieldGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.selectWrapper}>
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${styles.select} ${isActive ? styles.selectActive : ''}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className={styles.option}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.selectArrow} aria-hidden="true">
          ▾
        </span>
      </div>
    </div>
  );
}
