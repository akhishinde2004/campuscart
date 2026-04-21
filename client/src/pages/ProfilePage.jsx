import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import ListingCard from '../components/listings/ListingCard'

export default function ProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/users/profile/${id}`),
      api.get('/listings', { params: { seller: id, limit: 12 } })
    ]).then(([userRes, listRes]) => {
      setProfile(userRes.data)
      setListings(listRes.data.listings)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-gray-400">User not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="card p-8 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary flex-shrink-0">
          {profile.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-400 mt-1">{profile.college}</p>
          <div className="flex gap-3 mt-2">
            <span className="text-xs bg-white/5 px-3 py-1 rounded-full">{profile.year} Year</span>
            {profile.department && (
              <span className="text-xs bg-white/5 px-3 py-1 rounded-full">{profile.department}</span>
            )}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">{listings.length} Active Listings</h2>
      </div>

      {listings.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <div className="text-4xl mb-3">📭</div>
          <p>No active listings from this seller.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map(l => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}
    </div>
  )
}
