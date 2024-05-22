'use client';

import * as React from 'react';
import '@/lib/env';

import ButtonLink from '@/components/links/ButtonLink';

import Logo from '~/svg/Logo.svg';
import { useCallback, useState } from 'react';
import { useAssets } from './hooks/useAssets';
import debounce from 'lodash.debounce'
import { FixedSizeList as List } from 'react-window'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { assets, setPage, loading, hasMore } = useAssets(searchTerm)

  const handleSearch = useCallback((debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }, 300)), [])

  const loadMoreItems = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  return (
    <main>
      <section className='bg-white'>
        <div className='layout relative flex min-h-scree\n flex-col items-center py-12 text-center'>
          <Logo className='w-16' />
{/*           <h1 className='mt-4'>Code challenge</h1>

          <p className='mt-2 text-sm text-gray-800'>
            You have complete freedom to present the data here.
          </p> */}
          <List
            height={1000}
            itemCount={assets.length}
            itemSize={100}
            width={'100%'}
            onItemsRendered={({visibleStopIndex}) => {
              if(visibleStopIndex + 1 === assets.length && hasMore && !loading) {
                loadMoreItems()
              }
            }}
          >
            {({ index, style }) => (
              <div style={style} key={assets[index].id}>
                <p className='mt-2 text-sm text-gray-800'>{assets[index].host}</p>
                <p className='mt-2 text-sm text-gray-800'>{assets[index].comment}</p>
                <p className='mt-2 text-sm text-gray-800'>{assets[index].ip}</p>
                <p className='mt-2 text-sm text-gray-800'>{assets[index].owner}</p>
              </div>
            )}
          </List>

          <ButtonLink className='mt-6' href='/components' variant='light'>
            See all included components
          </ButtonLink>

        </div>
      </section>
    </main>
  );
}
