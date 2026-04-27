import fs from 'fs';
import path from 'path';
import { parseCSV } from '@/lib/parseCSV';
import Gallery from '../Gallery';

export default function GPT4oPage() {
  const rows = parseCSV(
    fs.readFileSync(path.join(process.cwd(), 'ops_commons_doc_types_classifier_gpt40.csv'), 'utf-8')
  );

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

  return <Gallery rows={rows} stats={{ sortedTypes }} />;
}
