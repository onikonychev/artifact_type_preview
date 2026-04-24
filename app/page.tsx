import fs from 'fs';
import path from 'path';
import Gallery, { type Row } from './Gallery';

function parseCSV(text: string): Row[] {
  const lines = text.trim().split('\n');
  return lines
    .slice(1)
    .map((line) => {
      const values: string[] = [];
      let inQuote = false;
      let current = '';
      for (const ch of line) {
        if (ch === '"') {
          inQuote = !inQuote;
        } else if (ch === ',' && !inQuote) {
          values.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      values.push(current.trim());
      return {
        file_id: values[0] ?? '',
        artifact_id: values[1] ?? '',
        slug: values[2] ?? '',
        img_key: values[3] ?? '',
        document_type: values[4] ?? '',
        is_journal_article: values[5] === 'true',
        reason: values[6] ?? '',
        is_csis: values[7] === 'true',
      };
    })
    .filter((r) => r.file_id !== '');
}

export default function Home() {
  const csvPath = path.join(process.cwd(), 'ops_commons_doc_types_classifier.csv');
  const rows = parseCSV(fs.readFileSync(csvPath, 'utf-8'));

  const total = rows.length;
  const journalCount = rows.filter((r) => r.is_journal_article).length;
  const journalPct = total > 0 ? ((journalCount / total) * 100).toFixed(1) : '0';
  const csisCount = rows.filter((r) => r.is_csis).length;

  const typeCounts = rows.reduce<Record<string, number>>((acc, r) => {
    const t = r.document_type || 'unknown';
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});
  const sortedTypes = Object.entries(typeCounts).sort(([a], [b]) => {
    if (a === 'journal article') return -1;
    if (b === 'journal article') return 1;
    return typeCounts[b] - typeCounts[a];
  });

  return (
    <main className="p-6 max-w-screen-2xl mx-auto font-sans">
      <h1 className="text-xl font-semibold mb-5 text-gray-800">Artifact Type Preview</h1>
      <Gallery rows={rows} stats={{ total, journalCount, journalPct, csisCount, sortedTypes }} />
    </main>
  );
}
