import fs from 'fs';
import path from 'path';
import { parseCSV } from '@/lib/parseCSV';
import GallerySimple from '../GallerySimple';

export default function GPT55Page() {
  const rows = parseCSV(
    fs.readFileSync(path.join(process.cwd(), 'ops_commons_doc_types_classifier_gpt55.csv'), 'utf-8')
  );

  const typeCounts = rows.reduce<Record<string, number>>((acc, r) => {
    const t = r.document_type || 'unknown';
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  return <GallerySimple rows={rows} stats={{ sortedTypes }} />;
}
