import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import ListingCard from '../components/listings/ListingCard'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [savedListings, setSavedListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('mine')

  useEffect(() => {
    Promise.all([
      api.get('/listings/mine'),
      api.get('/listings/saved'),
    ]).then(([myRes, savedRes]) => {
      setListings(myRes.data)
      setSavedListings(savedRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const toggleAvailability = async (id, current) => {
    try {
      await api.put(`/listings/${id}`, { isAvailable: !current })
      setListings(prev => prev.map(l => l._id === id ? { ...l, isAvailable: !current } : l))
      toast.success(current ? 'Marked as sold' : 'Relisted!')
    } catch {
      toast.error('Update failed')
    }
  }

  const deleteListing = async (id) => {
    if (!confirm('Delete this listing?')) return
    try {
      await api.delete(`/listings/${id}`)
      setListings(prev => prev.filter(l => l._id !== id))
      toast.success('Listing deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {user?.name} · {user?.college} · {user?.year} Year
          </p>
        </div>
        <Link to="/sell" className="btn-primary text-sm">+ New Listing</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card p-5 text-center">
          <div className="text-2xl font-bold text-primary">{listings.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {listings.filter(l => l.isAvailable).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Active</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-bold text-gray-500">
            {listings.filter(l => !l.isAvailable).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Sold</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-bold text-yellow-400">{savedListings.length}</div>
          <div className="text-xs text-gray-500 mt-1">Saved</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[['mine', 'My Listings'], ['saved', '🔖 Saved']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === key ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* My Listings Tab */}
      {tab === 'mine' && (
        loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-20 animate-pulse" />)}</div>
        ) : listings.length === 0 ? (
          <div className="card p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">📭</div>
            <p>No listings yet.</p>
            <Link to="/sell" className="btn-primary inline-block mt-4 text-sm">Post your first item</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(listing => (
              <div key={listing._id} className="card p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#111118] flex-shrink-0">
                  {listing.images?.[0] ? (
                    <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/listings/${listing._id}`} className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1">
                    {listing.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-primary text-sm font-bold">₹{listing.price}</span>
                    <span className="text-xs text-gray-500">{listing.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${listing.isAvailable ? 'bg-emerald-400/10 text-emerald-400' : 'bg-gray-500/10 text-gray-500'}`}>
                      {listing.isAvailable ? 'Active' : 'Sold'}
                    </span>
                    {listing.savedBy?.length > 0 && (
                      <span className="text-xs text-gray-500">🔖 {listing.savedBy.length}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/listings/${listing._id}`}
                    className="text-xs border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-gray-400">
                    ✏️ Edit
                  </Link>
                  <button onClick={() => toggleAvailability(listing._id, listing.isAvailable)}
                    className="text-xs border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-gray-400">
                    {listing.isAvailable ? 'Mark Sold' : 'Relist'}
                  </button>
                  <button onClick={() => deleteListing(listing._id)}
                    className="text-xs border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Saved Tab */}
      {tab === 'saved' && (
        savedListings.length === 0 ? (
          <div className="card p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">🔖</div>
            <p>No saved listings yet.</p>
            <Link to="/listings" className="btn-primary inline-block mt-4 text-sm">Browse Listings</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedListings.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        )
      )}
    </div>
  )
}
