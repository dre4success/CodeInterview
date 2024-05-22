import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

const PAGE_SIZE = 100;

export interface Asset {
    host: string;
    id: number;
    comment: string;
    ip: string;
    owner: string;
}

interface FetchAssetsResponse {
    assets: Asset[];
  }
  
  interface QueryParams {
    pageParam?: number;
    queryKey: string[];
  }

const fetchAssets = async ({ pageParam = 1, queryKey }: QueryParams) => {
    const [_key, searchTerm] = queryKey;
    const response = await axios.get('/api/assets', {
        params: {
            page: pageParam,
            limit: PAGE_SIZE,
            host: searchTerm,
        },
    });
    return response.data;
};

export const useAssets = (searchTerm: string) => {
    return useInfiniteQuery({
        queryKey: ['assets', searchTerm],
        queryFn: fetchAssets,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 0) {
                return undefined;
            }
            return pages.length + 1;
        },
    });
};