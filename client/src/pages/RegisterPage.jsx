import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    college: '', year: '1st', department: '', phone: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Welcome to CampusCart 🎉')
      navigate('/listings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="card p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Create account</h1>
        <p className="text-gray-400 text-sm mb-8">Join your campus marketplace</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="input" placeholder="Rahul Sharma" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="input" placeholder="9876543210" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="input" placeholder="you@college.edu" required />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="input" placeholder="Min. 6 characters" required minLength={6} />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">College Name</label>
            <input name="college" value={form.college} onChange={handleChange}
              className="input" placeholder="G. H. Raisoni College of Engineering" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Year</label>
              <select name="year" value={form.year} onChange={handleChange} className="input">
                {['1st','2nd','3rd','4th','PG'].map(y => (
                  <option key={y} value={y}>{y} Year</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Department</label>
              <input name="department" value={form.department} onChange={handleChange}
                className="input" placeholder="CSE, ECE, MECH..." />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full mt-2 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
