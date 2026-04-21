import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import ListingCard from '../components/listings/ListingCard'

export default function ListingDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [sellerContact, setSellerContact] = useState(null)
  const [interestLoading, setInterestLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveCount, setSaveCount] = useState(0)
  const [related, setRelated] = useState([])
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    setLoading(true)
    api.get(`/listings/${id}`)
      .then(res => {
        setListing(res.data)
        setEditForm({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          category: res.data.category,
          condition: res.data.condition,
        })
        setSaveCount(res.data.savedBy?.length || 0)
        if (user) setSaved(res.data.savedBy?.includes(user._id))
      })
      .catch(() => navigate('/listings'))
      .finally(() => setLoading(false))

    api.get(`/listings/${id}/related`)
      .then(res => setRelated(res.data))
      .catch(() => {})
  }, [id, user])

  const handleInterest = async () => {
    if (!user) { navigate('/login'); return }
    setInterestLoading(true)
    try {
      const res = await api.post(`/listings/${id}/interest`)
      setSellerContact(res.data.sellerContact)
      toast.success('Seller contact revealed!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setInterestLoading(false)
    }
  }

  const handleToggleSave = async () => {
    if (!user) { navigate('/login'); return }
    try {
      const res = await api.post(`/listings/${id}/save`)
      setSaved(res.data.saved)
      setSaveCount(res.data.saveCount)
      toast.success(res.data.saved ? 'Saved! 🔖' : 'Removed from saved')
    } catch {
      toast.error('Could not save listing')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return
    try {
      await api.delete(`/listings/${id}`)
      toast.success('Listing deleted')
      navigate('/dashboard')
    } catch {
      toast.error('Could not delete listing')
    }
  }

  const handleEditSave = async () => {
    try {
      const res = await api.put(`/listings/${id}`, editForm)
      setListing(res.data)
      setEditing(false)
      toast.success('Listing updated!')
    } catch {
      toast.error('Update failed')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied! 🔗')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!listing) return null

  const isOwner = user?._id === listing.seller?._id
  const whatsappLink = listing.seller?.phone
    ? `https://wa.me/91${listing.seller.phone}?text=Hi! I'm interested in your listing "${listing.title}" on CampusCart.`
    : null

  const CATEGORIES = ['Books', 'Electronics', 'Stationery', 'Hostel', 'Notes', 'Misc']
  const CONDITIONS = ['New', 'Like New', 'Good', 'Fair']

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Lightbox */}
      {lightbox && listing.images?.[activeImg] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}>
          <img src={listing.images[activeImg]} alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl" />
          <button className="absolute top-4 right-4 text-white text-3xl">✕</button>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-1">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#1a1a24] mb-3 cursor-zoom-in relative"
            onClick={() => setLightbox(true)}>
            {!listing.isAvailable && (
              <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full text-lg rotate-[-15deg]">SOLD</span>
              </div>
            )}
            {listing.images?.[activeImg] ? (
              <img src={listing.images[activeImg]} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
              🔍 Click to zoom
            </div>
          </div>
          {listing.images?.length > 1 && (
            <div className="flex gap-2">
              {listing.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-primary' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {editing ? (
            // Edit Mode
            <div className="space-y-4">
              <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
                className="input text-lg font-bold" />
              <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}
                className="input min-h-[80px] resize-none" rows={3} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})}
                  className="input" placeholder="Price" />
                <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2 flex-wrap">
                {CONDITIONS.map(c => (
                  <button type="button" key={c} onClick={() => setEditForm({...editForm, condition: c})}
                    className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${editForm.condition === c ? 'bg-primary border-primary text-white' : 'border-white/10 text-gray-400'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={handleEditSave} className="btn-primary flex-1">Save Changes</button>
                <button onClick={() => setEditing(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold leading-tight">{listing.title}</h1>
                <span className="text-2xl font-bold text-primary whitespace-nowrap">₹{listing.price}</span>
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                <span className="text-sm bg-white/5 px-3 py-1 rounded-full">{listing.category}</span>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">{listing.condition}</span>
                {!listing.isAvailable && (
                  <span className="text-sm bg-red-400/10 text-red-400 px-3 py-1 rounded-full">Sold</span>
                )}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-5">{listing.description}</p>

              {/* Save count */}
              {saveCount > 0 && (
                <p className="text-xs text-gray-500 mb-4">🔖 {saveCount} {saveCount === 1 ? 'person has' : 'people have'} saved this</p>
              )}

              {/* Seller info */}
              <div className="card p-4 mb-5">
                <p className="text-xs text-gray-500 mb-1">Seller</p>
                <Link to={`/profile/${listing.seller?._id}`} className="font-semibold hover:text-primary transition-colors">
                  {listing.seller?.name}
                </Link>
                <p className="text-sm text-gray-400">{listing.seller?.college} · {listing.seller?.year} Year</p>
              </div>

              {/* Seller contact after interest */}
              {sellerContact && (
                <div className="card p-4 border border-primary/30 mb-5">
                  <p className="text-xs text-primary mb-2 font-semibold">📞 Seller Contact</p>
                  <p className="font-semibold">{sellerContact.name}</p>
                  {sellerContact.phone && <p className="text-sm text-gray-300">📱 {sellerContact.phone}</p>}
                  <p className="text-sm text-gray-300">✉️ {sellerContact.email}</p>
                  {whatsappLink && (
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                      💬 Chat on WhatsApp
                    </a>
                  )}
                </div>
              )}

              {/* Action buttons */}
              {isOwner ? (
                <div className="flex gap-3">
                  <button onClick={() => setEditing(true)}
                    className="flex-1 btn-outline text-sm py-2.5">
                    ✏️ Edit
                  </button>
                  <button onClick={handleDelete}
                    className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-500/20 transition-all text-sm">
                    🗑️ Delete
                  </button>
                </div>
              ) : listing.isAvailable ? (
                <div className="space-y-3">
                  {!sellerContact && (
                    <button onClick={handleInterest} disabled={interestLoading}
                      className="btn-primary w-full py-3 text-base disabled:opacity-60">
                      {interestLoading ? 'Loading...' : "I'm Interested — Show Contact"}
                    </button>
                  )}
                  <div className="flex gap-3">
                    <button onClick={handleToggleSave}
                      className={`flex-1 border px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                      {saved ? '🔖 Saved' : '🔖 Save'}
                    </button>
                    <button onClick={handleShare}
                      className="flex-1 border border-white/10 text-gray-400 px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-white/30 transition-all">
                      🔗 Share
                    </button>
                  </div>
                </div>
              ) : null}

              <p className="text-xs text-gray-600 mt-4">
                Listed {new Date(listing.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Related Listings */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-lg font-bold mb-6">More in {listing.category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        </div>
      )}
    </div>
  )
}
