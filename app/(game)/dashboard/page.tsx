/**
 * Dashboard Page
 * Main home page showing games, pet, and leaderboard
 */

import { createClient } from '@/lib/supabase/server'
import GameCard from '@/components/ui/GameCard'
import Link from 'next/link'
import {
  PuzzlePieceIcon,
  CalculatorIcon,
  BoltIcon,
  PhotoIcon,
  HeartIcon,
  ChartBarIcon,
  UsersIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user?.id)
    .single()

  // Fetch top 5 leaderboard
  const { data: leaderboard } = await supabase
    .from('user_stats')
    .select(`
      total_points,
      games_won,
      profiles:user_id (username)
    `)
    .order('total_points', { ascending: false })
    .limit(5)

  // Fetch online players count (simplified - counting recent active users)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count: onlineCount } = await supabase
    .from('game_scores')
    .select('user_id', { count: 'exact', head: true })
    .gte('created_at', oneHourAgo)

  const username = profile?.username || user?.email || 'Jogador'

  const singlePlayerGames = [
    {
      title: 'Sudoku',
      description: 'Resolva puzzles de lógica',
      icon: <PuzzlePieceIcon className="w-8 h-8" />,
      href: '/games/sudoku',
      points: '10-50 pts',
    },
    {
      title: '2048',
      description: 'Combine números até 2048',
      icon: <CalculatorIcon className="w-8 h-8" />,
      href: '/games/2048',
      points: '1 pt / 100',
    },
    {
      title: 'Campo Minado',
      description: 'Encontre todas as minas',
      icon: <BoltIcon className="w-8 h-8" />,
      href: '/games/minesweeper',
      points: '30+ pts',
    },
    {
      title: 'Quebra-Cabeça',
      description: 'Monte a imagem deslizante',
      icon: <PhotoIcon className="w-8 h-8" />,
      href: '/games/puzzle',
      points: '20 pts',
    },
    {
      title: 'Blackjack',
      description: 'Jogue contra a casa',
      icon: <HeartIcon className="w-8 h-8" />,
      href: '/games/blackjack',
      points: '5-10 pts',
    },
  ]

  const multiplayerGames = [
    {
      title: 'Xadrez',
      description: 'Jogo clássico de estratégia',
      icon: <ChartBarIcon className="w-8 h-8" />,
      href: '/multiplayer/chess',
      points: '50 pts',
    },
    {
      title: 'Damas',
      description: 'Capture todas as peças',
      icon: <UsersIcon className="w-8 h-8" />,
      href: '/multiplayer/checkers',
      points: '30 pts',
    },
    {
      title: 'Gamão',
      description: 'Corrida com dados',
      icon: <TrophyIcon className="w-8 h-8" />,
      href: '/multiplayer/backgammon',
      points: '40 pts',
    },
    {
      title: 'Ludo',
      description: 'Leve suas peças até o fim',
      icon: <UsersIcon className="w-8 h-8" />,
      href: '/multiplayer/ludo',
      points: '25 pts',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bem-vindo, {username}! 👋
        </h1>
        <p className="text-gray-600">
          {onlineCount || 0} jogadores online agora
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pet Card */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">🐱 Pet da Equipe</h2>
            <p className="mb-4 opacity-90">
              Cuide do pet da equipe e ganhe recompensas!
            </p>
            <Link
              href="/pet"
              className="inline-block bg-white text-orange-600 font-semibold px-6 py-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Ver Pet
            </Link>
          </div>
        </div>

        {/* Mini Leaderboard */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <TrophyIcon className="w-5 h-5 text-orange-500 mr-2" />
            Top 5 Ranking
          </h3>
          <div className="space-y-3">
            {leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((entry: { profiles?: { username?: string }; total_points: number }, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-orange-500">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-gray-700">
                      {entry.profiles?.username || 'Jogador'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-orange-600">
                    {entry.total_points} pts
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Nenhum jogador ainda</p>
            )}
          </div>
          <Link
            href="/ranking"
            className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium mt-4"
          >
            Ver ranking completo →
          </Link>
        </div>
      </div>

      {/* Single Player Games */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Jogos Solo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {singlePlayerGames.map((game) => (
            <GameCard key={game.title} {...game} />
          ))}
        </div>
      </div>

      {/* Multiplayer Games */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Jogos Multiplayer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {multiplayerGames.map((game) => (
            <GameCard key={game.title} {...game} />
          ))}
        </div>
      </div>
    </div>
  )
}
