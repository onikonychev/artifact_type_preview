'use client';

import { useState } from 'react';
import { type Row, imageUrl, artifactUrl } from '@/lib/parseCSV';

type JournalFilter = 'all' | 'journal' | 'non-journal';

interface Stats {
  sortedTypes: [string, number][];
}

export default function GallerySimple({ rows }: { rows: Row[]; stats: Stats }) {
  const [journalFilter, setJournalFilter] = useState<JournalFilter>('all');
  const [csisFilter, setCsisFilter] = useState<boolean | null>(null);

  const visible = rows
    .filter((r) => {
      if (journalFilter === 'journal') return r.is_journal_article;
      if (journalFilter === 'non-journal') return !r.is_journal_article;
      return true;
    })
    .filter((r) => csisFilter === null || r.is_csis === csisFilter);

  const csisRows = csisFilter === null ? rows : rows.filter((r) => r.is_csis === csisFilter);
  const total = csisRows.length;
  const journalCount = csisRows.filter((r) => r.is_journal_article).length;
  const journalPct = total > 0 ? ((journalCount / total) * 100).toFixed(1) : '0';
  const csisCount = csisRows.filter((r) => r.is_csis).length;

  return (
    <>
      {/* Stats */}
      <section className="mb-6 rounded-xl border bg-gray-50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div className="flex flex-wrap gap-4">
            <StatCard label="Total" value={total} />
            <StatCard label="Journal Articles" value={journalCount} />
            <StatCard label="Journal %" value={`${journalPct}%`} />
            <StatCard label="CSIS" value={csisCount} />
          </div>

          {/* CSIS filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">CSIS</span>
            {([null, true, false] as const).map((val) => (
              <button
                key={String(val)}
                onClick={() => setCsisFilter(val)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  csisFilter === val
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {val === null ? 'All' : val ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>

        {/* Journal article switcher */}
        <div className="flex gap-1">
          {([
            { val: 'all', label: 'All', count: rows.length },
            { val: 'journal', label: 'Journal Article', count: journalCount },
            { val: 'non-journal', label: 'Non Journal Article', count: total - journalCount },
          ] as const).map(({ val, label, count }) => (
            <button
              key={val}
              onClick={() => setJournalFilter(val)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                journalFilter === val
                  ? 'bg-gray-900 text-white'
                  : val === 'journal'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 mb-4">{visible.length} items</p>

      {/* Gallery */}
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
        {visible.map((row, i) => (
          <div key={`${row.file_id}-${i}`} className="flex flex-col">
            <a
              href={artifactUrl(row)}
              target="_blank"
              rel="noopener noreferrer"
              title={row.slug}
              className="block overflow-hidden rounded-lg border bg-gray-100 hover:opacity-90 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(row.img_key)}
                alt={row.slug}
                width={200}
                height={300}
                style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </a>
            <div className="mt-2 space-y-1 px-0.5">
              <div className="flex flex-wrap items-center gap-1">
                {row.is_journal_article && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                    Journal Article
                  </span>
                )}
                {row.is_csis && (
                  <span className="text-xs text-gray-400">CSIS</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white px-4 py-3 shadow-sm min-w-[110px]">
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}
