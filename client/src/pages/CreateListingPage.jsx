import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Books', 'Electronics', 'Stationery', 'Hostel', 'Notes', 'Misc']
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair']

export default function CreateListingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Books', condition: 'Good'
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImages = e => {
    const files = Array.from(e.target.files).slice(0, 4)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      images.forEach(img => data.append('images', img))

      const res = await api.post('/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Listing posted!')
      navigate(`/listings/${res.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Post a Listing</h1>
      <p className="text-gray-400 text-sm mb-8">Fill in the details to list your item</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Title *</label>
          <input name="title" value={form.title} onChange={handleChange}
            className="input" placeholder="e.g. Operating Systems by Galvin (7th Ed)" required />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            className="input min-h-[100px] resize-none" rows={4}
            placeholder="Describe the item — edition, any wear, what's included..." required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Price (₹) *</label>
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange}
              className="input" placeholder="250" required />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Condition *</label>
          <div className="flex gap-2 flex-wrap">
            {CONDITIONS.map(c => (
              <button type="button" key={c}
                onClick={() => setForm({ ...form, condition: c })}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  form.condition === c
                    ? 'bg-primary border-primary text-white'
                    : 'border-white/10 text-gray-400 hover:border-white/30'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Photos (up to 4)</label>
          <input type="file" accept="image/*" multiple onChange={handleImages}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/20 file:text-primary file:font-medium hover:file:bg-primary/30 cursor-pointer" />
          {previews.length > 0 && (
            <div className="flex gap-2 mt-3">
              {previews.map((p, i) => (
                <img key={i} src={p} alt="" className="w-20 h-20 object-cover rounded-xl border border-white/10" />
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3 text-base disabled:opacity-60">
          {loading ? 'Posting...' : 'Post Listing'}
        </button>
      </form>
    </div>
  )
}
