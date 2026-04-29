import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f13]/90 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold" onClick={() => setOpen(false)}>
          <span className="text-primary">Campus</span>
          <span className="text-accent">Cart</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/listings" className="text-gray-300 hover:text-white transition-colors text-sm">
            Browse
          </Link>
          {user ? (
            <>
              <Link to="/sell" className="btn-primary text-sm py-2 px-4">+ Sell</Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white text-sm transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-white text-sm transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white text-sm transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0f0f13] px-4 py-4 flex flex-col gap-4">
          <Link to="/listings" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white text-sm">Browse</Link>
          {user ? (
            <>
              <Link to="/sell" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 px-4 text-center">+ Sell</Link>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white text-sm">Dashboard</Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-white text-sm text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white text-sm">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 px-4 text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
