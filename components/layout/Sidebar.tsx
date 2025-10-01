/**
 * Sidebar Component
 * Main navigation sidebar for ENROLATION HUB
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  PuzzlePieceIcon,
  UsersIcon,
  HeartIcon,
  TrophyIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Jogos Solo', href: '/games', icon: PuzzlePieceIcon },
  { name: 'Multiplayer', href: '/multiplayer/lobby', icon: UsersIcon },
  { name: 'Pet', href: '/pet', icon: HeartIcon },
  { name: 'Ranking', href: '/ranking', icon: TrophyIcon },
  { name: 'Perfil', href: '/profile', icon: UserCircleIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-retro-darker border-r-2 border-retro-magenta shadow-lg shadow-retro-magenta/50">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div className="flex items-center h-20 flex-shrink-0 px-4 border-b-2 border-retro-cyan bg-gradient-to-r from-retro-darker to-retro-dark">
          <h1 className="text-2xl font-bold tracking-wider">
            <span className="text-retro-magenta rgb-shadow">ENROLATION</span>
            <br />
            <span className="text-retro-cyan text-lg"> {'//'} / HUB</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto bg-retro-dark">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-4 py-3 text-sm font-bold rounded-none transition-all duration-200
                  border-l-4
                  ${
                    isActive
                      ? 'bg-retro-magenta/20 text-retro-cyan border-retro-cyan retro-glow'
                      : 'text-beige-300 border-transparent hover:bg-retro-magenta/10 hover:text-retro-magenta hover:border-retro-magenta'
                  }
                `}
                style={{ fontFamily: 'Courier New, monospace' }}
              >
                <item.icon
                  className={`
                    mr-3 flex-shrink-0 h-6 w-6 transition-colors
                    ${isActive ? 'text-retro-cyan' : 'text-beige-500 group-hover:text-retro-magenta'}
                  `}
                />
                {item.name.toUpperCase()}
              </Link>
            )
          })}
        </nav>

        {/* Footer Retro */}
        <div className="px-4 py-3 bg-retro-darker border-t-2 border-retro-green">
          <p className="text-xs text-retro-green text-center font-mono">
            &gt; SYSTEM ONLINE_
          </p>
        </div>
      </div>
    </div>
  )
}
