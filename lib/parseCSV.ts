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

export function parseCSV(text: string): Row[] {
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

export function imageUrl(imgKey: string) {
  return `https://img.coherentcommons.com/400x600/${imgKey}`;
}

export function artifactUrl(row: Row) {
  return `https://policycommons.net/artifacts/${row.artifact_id}/${row.slug}/${row.file_id}/`;
}
