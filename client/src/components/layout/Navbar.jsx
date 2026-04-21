import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f13]/90 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          <span className="text-primary">Campus</span>
          <span className="text-accent">Cart</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/listings" className="text-gray-300 hover:text-white transition-colors text-sm">
            Browse
          </Link>

          {user ? (
            <>
              <Link to="/sell" className="btn-primary text-sm py-2 px-4">
                + Sell
              </Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white text-sm transition-colors">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-white text-sm transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white text-sm transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
