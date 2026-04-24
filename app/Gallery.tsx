'use client';

import { useState } from 'react';

export interface Row {
  file_id: string;
  artifact_id: string;
  slug: string;
  img_key: string;
  document_type: string;
  is_journal_article: boolean;
  reason: string;
  is_csis: boolean;
}

interface Stats {
  total: number;
  journalCount: number;
  journalPct: string;
  csisCount: number;
  sortedTypes: [string, number][];
}

function imageUrl(imgKey: string) {
  return `https://img.coherentcommons.com/400x600/${imgKey}`;
}

export default function Gallery({ rows, stats }: { rows: Row[]; stats: Stats }) {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [csisFilter, setCsisFilter] = useState<boolean | null>(null);

  const visible = rows
    .filter((r) => activeType === null || r.document_type === activeType)
    .filter((r) => csisFilter === null || r.is_csis === csisFilter);

  return (
    <>
      {/* Stats */}
      <section className="mb-6 rounded-xl border bg-gray-50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div className="flex flex-wrap gap-4">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Journal Articles" value={stats.journalCount} />
            <StatCard label="Journal %" value={`${stats.journalPct}%`} />
            <StatCard label="CSIS" value={stats.csisCount} />
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

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveType(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeType === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-900'
            }`}
          >
            All
          </button>
          {stats.sortedTypes.map(([type, count]) => (
            <button
              key={type}
              onClick={() => setActiveType(activeType === type ? null : type)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeType === type
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-900'
              }`}
            >
              {type} <span className="opacity-60">{count}</span>
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
              href={`https://policycommons.net/artifacts/${row.artifact_id}/${row.slug}/${row.file_id}/`}
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
                <button
                  onClick={() => setActiveType(activeType === row.document_type ? null : row.document_type)}
                  className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                    activeType === row.document_type
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-900'
                  }`}
                >
                  {row.document_type}
                </button>
                {row.is_journal_article && (
                  <span className="text-xs text-gray-400" title="Journal article">JA</span>
                )}
                {row.is_csis && (
                  <span className="text-xs text-gray-400" title="CSIS">CSIS</span>
                )}
              </div>
              {row.reason && (
                <p className="text-xs text-gray-600 leading-snug line-clamp-2">{row.reason}</p>
              )}
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
