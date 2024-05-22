import axios from "axios"
import { useCallback, useEffect, useState } from "react"

const PAGE_SIZE = 100
type Assets = {
    host: string
    id: number
    comment: string
    ip: string
    owner: string
}
export const useAssets = (searchTerm: string) => {
    const [assets, setAssets] = useState<Assets[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const fetchAssets = useCallback(async (page: number, searchTerm: string) => {
        setLoading(true)
        try {
            const response = await axios.get('/api/assets', {
                params: {
                    page,
                    limit: PAGE_SIZE,
                    host: searchTerm
                }
            })
            setAssets((prevAssets) => (page === 1 ? response.data.assets : [...prevAssets, ...response.data.assets]))
        } catch (error) {
            console.error('Error fetching assets: ', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAssets(page, searchTerm)
    }, [page, searchTerm, fetchAssets])

    return { assets, setPage, loading, hasMore }
}