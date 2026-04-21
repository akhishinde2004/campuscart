import { Link } from 'react-router-dom'

const CATEGORIES = ['Books', 'Electronics', 'Stationery', 'Hostel', 'Notes', 'Misc']
const CATEGORY_ICONS = {
  Books: '📚', Electronics: '💻', Stationery: '✏️',
  Hostel: '🏠', Notes: '📝', Misc: '📦'
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-6">
          🎓 Made for College Students
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Buy &amp; Sell Within<br />
          <span className="text-primary">Your Campus</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          Stop overpaying on Amazon. Get textbooks, electronics, and more from your seniors — at student prices.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/listings" className="btn-primary text-base px-8 py-3">
            Browse Listings
          </Link>
          <Link to="/register" className="btn-outline text-base px-8 py-3">
            Start Selling
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/listings?category=${cat}`}
              className="card p-6 flex flex-col items-center gap-3 hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="text-3xl">{CATEGORY_ICONS[cat]}</span>
              <span className="text-sm font-medium text-gray-300">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Post Your Item', desc: 'List anything — books, gadgets, hostel essentials. Add photos, set your price.' },
            { step: '02', title: 'Students Browse', desc: 'Fellow students from your college find your listing and express interest.' },
            { step: '03', title: 'Connect & Sell', desc: 'Buyer gets your contact. Meet on campus, exchange item, done.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="card p-8">
              <div className="text-4xl font-bold text-primary/30 mb-4">{step}</div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        CampusCart © {new Date().getFullYear()} — Built for students, by students.
      </footer>
    </div>
  )
}
