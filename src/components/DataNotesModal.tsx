'use client';

import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Beaker, FileWarning } from 'lucide-react';

interface DataNotesModalProps {
  onClose: () => void;
}

export default function DataNotesModal({ onClose }: DataNotesModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative pixel-card max-w-2xl w-full max-h-[85vh] overflow-y-auto border-neon-purple box-glow-pink">
        <div className="sticky top-0 bg-card border-b-2 border-card-border px-6 py-4 flex items-center justify-between">
          <h2 className="font-pixel text-[9px] text-neon-purple tracking-wider">
            ▸ DATA NOTES & LIMITATIONS
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-card-border hover:border-rose hover:text-rose flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-primary" />
              <h3 className="font-pixel text-[7px] text-primary tracking-wider">CLEANING SUMMARY</h3>
            </div>
            <div className="border border-primary/30 bg-primary-light p-4 font-retro text-base text-foreground/80 space-y-2">
              <p>
                <span className="text-primary">Raw Dataset:</span> 16,598 rows →{' '}
                <span className="text-primary">Cleaned:</span> 16,322 rows
                <span className="text-muted ml-1">(−276 rows / 1.66% removed)</span>
              </p>
              <ul className="list-none space-y-1 ml-1">
                <li><span className="text-accent">►</span> <span className="text-foreground">271 rows</span> removed — missing Year values</li>
                <li><span className="text-accent">►</span> <span className="text-foreground">4 rows</span> removed — anomalous years (2017, 2020)</li>
                <li><span className="text-accent">►</span> <span className="text-foreground">1 duplicate</span> removed — &ldquo;Madden NFL 13&rdquo; (PS3, 2012)</li>
                <li><span className="text-accent">►</span> <span className="text-foreground">36 missing Publishers</span> standardized to &ldquo;Unknown&rdquo;</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Beaker className="w-4 h-4 text-secondary" />
              <h3 className="font-pixel text-[7px] text-secondary tracking-wider">FEATURE ENGINEERING</h3>
            </div>
            <div className="border border-secondary/30 bg-secondary-light p-4 font-retro text-base text-foreground/80 space-y-2">
              <p>Three derived columns added:</p>
              <ul className="list-none space-y-1 ml-1">
                <li><span className="text-secondary">►</span> <code className="text-accent bg-background px-1">Platform_Family</code> — Groups 31 platforms into 6 ecosystems</li>
                <li><span className="text-secondary">►</span> <code className="text-accent bg-background px-1">Decade</code> — Categorizes Year into 1980s–2010s</li>
                <li><span className="text-secondary">►</span> <code className="text-accent bg-background px-1">Dominant_Region</code> — Region with highest sales per title</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileWarning className="w-4 h-4 text-accent" />
              <h3 className="font-pixel text-[7px] text-accent tracking-wider">VALIDATION NOTE</h3>
            </div>
            <div className="border border-accent/30 bg-accent-light p-4 font-retro text-base text-foreground/80">
              <p>
                Sum of regional sales (<span className="text-accent">NA + EU + JP + Other = 8,815.51M</span>) has minor rounding variance vs recorded{' '}
                Global_Sales (<span className="text-accent">8,820.01M</span>).
              </p>
              <p className="mt-1.5 text-muted text-sm">
                {'>'} ≈4.50M (0.05%) discrepancy — inherent in source 2-decimal rounding per row.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose" />
              <h3 className="font-pixel text-[7px] text-rose tracking-wider">KEY LIMITATIONS</h3>
            </div>
            <div className="border border-rose/30 bg-rose-light p-4 space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 border border-rose text-rose font-pixel text-[8px] flex items-center justify-center">1</span>
                <div className="font-retro text-base text-foreground/80">
                  <p className="text-rose font-bold">Retail / Physical Sales Bias</p>
                  <p className="mt-0.5">
                    Data captures physical retail only. Digital (Steam, PSN, eShop), mobile, F2P microtransactions excluded. Causes artificial decline post-2011.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 border border-rose text-rose font-pixel text-[8px] flex items-center justify-center">2</span>
                <div className="font-retro text-base text-foreground/80">
                  <p className="text-rose font-bold">Incomplete 2016 Cutoff</p>
                  <p className="mt-0.5">Partial year capture — late 2016 titles underrepresented.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 border border-rose text-rose font-pixel text-[8px] flex items-center justify-center">3</span>
                <div className="font-retro text-base text-foreground/80">
                  <p className="text-rose font-bold">Bundled Title Outlier</p>
                  <p className="mt-0.5">
                    <em>Wii Sports</em> (82.74M) bundled with Wii hardware outside Japan, inflating standalone sales figure.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-card border-t-2 border-card-border px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="pixel-btn px-4 py-2 border-primary bg-primary-light text-primary font-pixel text-[8px] hover:bg-primary/20 transition-colors tracking-wider"
          >
            CLOSE [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
