/**
 * Game Layout
 * Main layout for authenticated game pages with sidebar and header
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile and stats
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  const { data: stats } = await supabase
    .from('user_stats')
    .select('total_points')
    .eq('user_id', user.id)
    .single()

  const username = profile?.username || user.email || 'Jogador'
  const totalPoints = stats?.total_points || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <Header username={username} totalPoints={totalPoints} />

        {/* Page Content */}
        <main className="py-6 px-4 md:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
