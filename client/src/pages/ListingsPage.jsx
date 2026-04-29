import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import ListingCard from '../components/listings/ListingCard'

const CATEGORIES = ['All', 'Books', 'Electronics', 'Stationery', 'Hostel', 'Notes', 'Misc']

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [maxPrice, setMaxPrice] = useState('')

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      if (category !== 'All') params.category = category
      if (maxPrice) params.maxPrice = maxPrice
      if (search) params.search = search

      const res = await api.get('/listings', { params })
      setListings(res.data.listings)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchListings() }, [category, page, maxPrice])

  const handleSearch = e => {
    e.preventDefault()
    fetchListings()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header + Search */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Browse Listings</h1>
          <p className="text-gray-500 text-sm mt-1">{total} items available</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input flex-1"
            placeholder="Search items..."
          />
          <button type="submit" className="btn-primary px-4 py-2 text-sm whitespace-nowrap">Search</button>
        </form>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        {/* Category pills - scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1) }}
              className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Max price - separate row on mobile */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">Max Price ₹</span>
          <input
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="input w-28 py-1.5 text-sm"
            placeholder="5000"
            type="number"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse aspect-square bg-white/5" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🛒</div>
          <p>No listings found. Try different filters!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {listings.map(l => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="flex justify-center gap-2 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-outline text-sm px-4 py-2 disabled:opacity-30">← Prev</button>
          <span className="text-gray-500 text-sm flex items-center px-4">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={listings.length < 12}
            className="btn-outline text-sm px-4 py-2 disabled:opacity-30">Next →</button>
        </div>
      )}
    </div>
  )
}
