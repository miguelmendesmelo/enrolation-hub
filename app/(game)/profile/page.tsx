/**
 * Profile Page
 * User profile with stats and badges
 */

import { createClient } from '@/lib/supabase/server'
import { StarIcon, TrophyIcon, FireIcon, HeartIcon } from '@heroicons/react/24/solid'

export default async function ProfilePage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Não autenticado</div>
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch user stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Fetch user badges
  const { data: badges } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', user.id)

  // Fetch recent game history
  const { data: recentGames } = await supabase
    .from('game_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get user rank
  const { count: userRank } = await supabase
    .from('user_stats')
    .select('*', { count: 'exact', head: true })
    .gt('total_points', stats?.total_points || 0)

  const rank = (userRank || 0) + 1

  const badgeInfo: Record<string, { name: string; icon: string; description: string }> = {
    first_win: { name: 'Primeira Vitória', icon: '🎯', description: 'Ganhe sua primeira partida' },
    '10_games': { name: '10 Jogos', icon: '🎮', description: 'Jogue 10 partidas' },
    champion_week: { name: 'Campeão da Semana', icon: '👑', description: 'Seja o melhor da semana' },
    pet_guardian: { name: 'Guardião do Pet', icon: '🐱', description: 'Interaja 10x com o pet' },
    '100_points': { name: '100 Pontos', icon: '💯', description: 'Alcance 100 pontos' },
    multiplayer_master: { name: 'Mestre Multiplayer', icon: '⚔️', description: 'Ganhe 5 partidas multiplayer' },
  }

  const gameTypeNames: Record<string, string> = {
    '2048': '2048',
    sudoku: 'Sudoku',
    minesweeper: 'Campo Minado',
    puzzle: 'Quebra-Cabeça',
    blackjack: 'Blackjack',
    chess: 'Xadrez',
    checkers: 'Damas',
    backgammon: 'Gamão',
    ludo: 'Ludo',
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Meu Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
              👤
            </div>
            <h2 className="text-2xl font-bold mb-1">{profile?.username || user.email}</h2>
            <p className="text-orange-100 text-sm mb-4">
              Membro desde {new Date(profile?.created_at || '').toLocaleDateString('pt-BR')}
            </p>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm opacity-90">Posição no Ranking</p>
              <p className="text-3xl font-bold">#{rank}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <StarIcon className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-orange-600">{stats?.total_points || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Pontos Totais</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <TrophyIcon className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-green-600">{stats?.games_won || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Vitórias</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <FireIcon className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-blue-600">{stats?.games_played || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Jogos Jogados</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <HeartIcon className="w-8 h-8 text-red-500" />
              <span className="text-3xl font-bold text-red-600">
                {stats?.games_played ? Math.round(((stats?.games_won || 0) / stats.games_played) * 100) : 0}%
              </span>
            </div>
            <p className="text-gray-600 font-medium">Taxa de Vitória</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Conquistas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(badgeInfo).map(([type, info]) => {
            const earned = badges?.some(b => b.badge_type === type)
            return (
              <div
                key={type}
                className={`text-center p-4 rounded-lg transition-all ${
                  earned
                    ? 'bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{info.icon}</div>
                <p className="text-xs font-semibold text-gray-700">{info.name}</p>
                {earned && <p className="text-xs text-orange-600 mt-1">✓ Desbloqueado</p>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Games */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Jogos Recentes</h3>
        <div className="space-y-3">
          {recentGames && recentGames.length > 0 ? (
            recentGames.map((game) => (
              <div key={game.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎮</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {gameTypeNames[game.game_type] || game.game_type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(game.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">+{game.points_earned} pts</p>
                  <p className="text-sm text-gray-500">Score: {game.score}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum jogo jogado ainda</p>
          )}
        </div>
      </div>
    </div>
  )
}
