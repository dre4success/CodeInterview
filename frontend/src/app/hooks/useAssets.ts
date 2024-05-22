import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 100;

export interface Asset {
    host: string;
    id: number;
    comment: string;
    ip: string;
    owner: string;
}

interface QueryParams {
    pageParam?: number;
    queryKey: string[];
}

const fetchAssets = async ({ pageParam = 1, queryKey }: QueryParams) => {
    const [, searchTerm] = queryKey;
    const response = await fetch(`/api/assets/?page=${pageParam}&limit=${PAGE_SIZE}&host=${searchTerm}`);
    return response.json();
};

export const useAssets = (searchTerm: string) => {
    return useInfiniteQuery({
        queryKey: ['assets', searchTerm],
        queryFn: fetchAssets,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage?.assets?.length) {
                return undefined;
            }
            return pages.length + 1;
        },
    });
};