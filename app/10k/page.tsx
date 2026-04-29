import fs from 'fs';
import path from 'path';
import { parseCSV10k } from '@/lib/parseCSV';
import Gallery10k from '../Gallery10k';

export default function Page10k() {
  const rows = parseCSV10k(
    fs.readFileSync(path.join(process.cwd(), 'ops_commons_doc_types_classifier_10k.csv'), 'utf-8')
  );
  return <Gallery10k rows={rows} />;
}
