'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: '10k', href: '/10k' },
  { label: 'GPT-5.5', href: '/' },
  { label: 'GPT-4o', href: '/gpt4o' },
];

export default function Tabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 mb-6 border-b">
      {tabs.map(({ label, href }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-5 py-2 text-sm font-semibold rounded-t transition-colors ${
              active
                ? 'bg-white border border-b-white -mb-px text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
