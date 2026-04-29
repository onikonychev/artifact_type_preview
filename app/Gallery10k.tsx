'use client';

import { useState } from 'react';
import { type Row10k, imageUrl } from '@/lib/parseCSV';

type Filter = 'all' | 'journal' | 'non-journal';

export default function Gallery10k({ rows }: { rows: Row10k[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const total = rows.length;
  const journalCount = rows.filter((r) => r.is_journal_article).length;
  const journalPct = total > 0 ? ((journalCount / total) * 100).toFixed(1) : '0';

  const visible = rows.filter((r) => {
    if (filter === 'journal') return r.is_journal_article;
    if (filter === 'non-journal') return !r.is_journal_article;
    return true;
  });

  return (
    <>
      {/* Stats */}
      <section className="mb-6 rounded-xl border bg-gray-50 p-5">
        <div className="flex flex-wrap gap-4 mb-5">
          <StatCard label="Total" value={total} />
          <StatCard label="Journal Articles" value={journalCount} />
          <StatCard label="Journal %" value={`${journalPct}%`} />
        </div>

        <div className="flex gap-1">
          {([
            { val: 'all', label: 'All', count: total },
            { val: 'journal', label: 'Journal Article', count: journalCount },
            { val: 'non-journal', label: 'Non Journal Article', count: total - journalCount },
          ] as const).map(({ val, label, count }) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === val
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
            {row.is_journal_article && (
              <div className="mt-2 px-0.5">
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                  Journal Article
                </span>
              </div>
            )}
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
