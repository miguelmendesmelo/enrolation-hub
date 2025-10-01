/**
 * Header Component
 * Top header bar with user info and logout for ENROLATION HUB
 */

'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowRightOnRectangleIcon, StarIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface HeaderProps {
  username: string
  totalPoints: number
}

export default function Header({ username, totalPoints }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [points, setPoints] = useState(totalPoints)

  useEffect(() => {
    setPoints(totalPoints)
  }, [totalPoints])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-retro-dark border-b-2 border-retro-cyan h-16 flex items-center justify-between px-6 md:pl-6 md:pr-8 shadow-lg shadow-retro-cyan/30">
      {/* Mobile Logo */}
      <div className="md:hidden">
        <h1 className="text-lg font-bold font-mono">
          <span className="text-retro-magenta">ENROLATION</span>
          <span className="text-retro-cyan"> HUB</span>
        </h1>
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-6 ml-auto">
        {/* Points Display */}
        <div className="flex items-center space-x-2 bg-retro-magenta/20 border-2 border-retro-magenta px-4 py-2 rounded-none">
          <StarIcon className="h-5 w-5 text-retro-yellow" />
          <span className="font-bold text-retro-cyan font-mono">{points} PTS</span>
        </div>

        {/* Username */}
        <div className="hidden md:block text-sm">
          <p className="font-bold text-retro-green font-mono">&gt; {username.toUpperCase()}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-beige-300 hover:text-retro-red hover:bg-retro-red/20 border-2 border-transparent hover:border-retro-red rounded-none transition-all font-mono"
          title="Sair"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="hidden md:inline">LOGOUT</span>
        </button>
      </div>
    </header>
  )
}
