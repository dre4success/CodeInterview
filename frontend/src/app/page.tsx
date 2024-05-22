// pages/index.tsx
'use client';

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';


import AssetCard from '../components/AssetCard';
import { useAssets } from './hooks/useAssets';
import { useDebouncedValue } from './hooks/useDebounce';

type AssetProps = {
  id: number;
  host: string;
  comment: string;
  ip: string;
  owner: string;
};

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useAssets(debouncedSearchTerm);

  const assets = data?.pages.flatMap(page => page.assets) ?? [];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className='bg-white py-8'>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Assets</h1>
          <input
            type="text"
            placeholder="Search by host..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md py-2 px-4 mb-6 w-full max-w-lg mx-auto block"
          />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset: AssetProps) => (
              <AssetCard key={asset.id} {...asset} />
            ))}
          </div>
          <div ref={loadMoreRef} className="h-10"></div>
          {isLoading && <p className="text-center">Loading...</p>}
          {isError && <p className="text-center text-red-500">Error loading data</p>}
        </div>
      </section>
    </main>
  );
}
