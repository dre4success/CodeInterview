
'use client';

import * as React from 'react';
import {  useState } from 'react';


import AssetCard from '../components/AssetCard';
import { useAssets } from './hooks/useAssets';

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
            placeholder="Search assets..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md py-2 px-4 mb-6 w-full max-w-lg mx-auto block"
          />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset: AssetProps) => (
              <AssetCard key={asset.id} {...asset} />
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function useDebouncedValue(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
