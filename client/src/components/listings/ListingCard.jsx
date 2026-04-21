import { Link } from 'react-router-dom'

const CONDITION_COLORS = {
  'New': 'text-emerald-400 bg-emerald-400/10',
  'Like New': 'text-blue-400 bg-blue-400/10',
  'Good': 'text-yellow-400 bg-yellow-400/10',
  'Fair': 'text-orange-400 bg-orange-400/10',
}

export default function ListingCard({ listing }) {
  const { _id, title, price, category, condition, images, college, isAvailable, savedBy } = listing

  return (
    <Link to={`/listings/${_id}`} className="card block overflow-hidden group relative">
      {/* Sold overlay */}
      {!isAvailable && (
        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-2xl">
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full rotate-[-15deg]">SOLD</span>
        </div>
      )}

      {/* Image */}
      <div className="aspect-square bg-[#111118] overflow-hidden">
        {images?.[0] ? (
          <img src={images[0]} alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-gray-700">📦</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">{title}</h3>
          <span className="text-primary font-bold text-sm whitespace-nowrap">₹{price}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{category}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${CONDITION_COLORS[condition] || 'text-gray-400'}`}>
            {condition}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600 truncate">{college}</p>
          {savedBy?.length > 0 && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              🔖 {savedBy.length}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
