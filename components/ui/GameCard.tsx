/**
 * Game Card Component
 * Displays a game option card
 */

import Link from 'next/link'

interface GameCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  points: string
}

export default function GameCard({
  title,
  description,
  icon,
  href,
  points,
}: GameCardProps) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-200 cursor-pointer">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mb-4 group-hover:bg-orange-200 transition-colors">
          <div className="text-orange-500 group-hover:text-orange-600">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {description}
        </p>

        {/* Points Info */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            {points}
          </span>
          <span className="text-orange-500 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  )
}
