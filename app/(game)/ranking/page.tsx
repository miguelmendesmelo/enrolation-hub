/**
 * Ranking Page
 * Displays global leaderboard and player statistics
 */

import { createClient } from '@/lib/supabase/server'
import { TrophyIcon, StarIcon, FireIcon } from '@heroicons/react/24/solid'

export default async function RankingPage() {
  const supabase = await createClient()

  // Fetch top 20 players
  const { data: leaderboard } = await supabase
    .from('user_stats')
    .select(`
      total_points,
      games_played,
      games_won,
      games_lost,
      profiles:user_id (username)
    `)
    .order('total_points', { ascending: false })
    .limit(20)

  // Get current user rank
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userRank = null
  if (user) {
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('total_points')
      .eq('user_id', user.id)
      .single()

    if (userStats) {
      const { count } = await supabase
        .from('user_stats')
        .select('*', { count: 'exact', head: true })
        .gt('total_points', userStats.total_points)

      userRank = (count || 0) + 1
    }
  }

  const getMedalIcon = (position: number) => {
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return `#${position}`
  }

  const getWinRate = (won: number, total: number) => {
    if (total === 0) return 0
    return Math.round((won / total) * 100)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <TrophyIcon className="w-8 h-8 text-orange-500 mr-3" />
            Ranking Global
          </h1>
          <p className="text-gray-600 mt-2">Top 20 jogadores da Strategi Games</p>
        </div>
        {userRank && (
          <div className="bg-orange-50 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600">Sua Posição</p>
            <p className="text-2xl font-bold text-orange-600">#{userRank}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Posição</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Jogador</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  <div className="flex items-center justify-center">
                    <StarIcon className="w-4 h-4 mr-1" />
                    Pontos
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Jogos</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  <div className="flex items-center justify-center">
                    <FireIcon className="w-4 h-4 mr-1" />
                    Vitórias
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Taxa de Vitória</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((entry: any, index: number) => {
                  const position = index + 1
                  const isTopThree = position <= 3
                  const winRate = getWinRate(entry.games_won, entry.games_played)

                  return (
                    <tr
                      key={index}
                      className={`hover:bg-orange-50 transition-colors ${
                        isTopThree ? 'bg-orange-50/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className={`text-2xl font-bold ${isTopThree ? '' : 'text-gray-600'}`}>
                          {getMedalIcon(position)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          {entry.profiles?.username || 'Jogador'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-orange-600 text-lg">
                          {entry.total_points}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700">
                        {entry.games_played}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-green-600">{entry.games_won}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-500">{entry.games_lost}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="bg-gray-200 rounded-full h-2 w-20 overflow-hidden mr-2">
                            <div
                              className="bg-green-500 h-full transition-all"
                              style={{ width: `${winRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{winRate}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhum jogador no ranking ainda. Seja o primeiro!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="text-lg font-semibold mb-1">Como Ganhar Pontos</h3>
          <p className="text-sm opacity-90">
            Jogue e vença partidas para ganhar pontos e subir no ranking!
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-4xl mb-2">🎮</div>
          <h3 className="text-lg font-semibold mb-1">Varie os Jogos</h3>
          <p className="text-sm opacity-90">
            Experimente diferentes jogos para maximizar seus pontos!
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-4xl mb-2">🐱</div>
          <h3 className="text-lg font-semibold mb-1">Cuide do Pet</h3>
          <p className="text-sm opacity-90">
            Interaja com o pet da equipe para ganhar badges especiais!
          </p>
        </div>
      </div>
    </div>
  )
}
