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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Browse Listings</h1>
          <p className="text-gray-500 text-sm mt-1">{total} items available</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input w-full md:w-64" placeholder="Search items..." />
          <button type="submit" className="btn-primary px-4 py-2 text-sm">Search</button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6 items-center">
        {CATEGORIES.map(cat => (
          <button key={cat}
            onClick={() => { setCategory(cat); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? 'bg-primary text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {cat}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">Max ₹</span>
          <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
            className="input w-24 py-1.5 text-sm" placeholder="5000" type="number" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
