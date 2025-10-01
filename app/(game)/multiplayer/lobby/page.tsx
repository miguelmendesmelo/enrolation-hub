/**
 * Multiplayer Lobby Page
 * Shows all available multiplayer games (Coming Soon)
 */

'use client'

import Link from 'next/link'
import {
  ChartBarIcon,
  UsersIcon,
  TrophyIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

export default function MultiplayerLobbyPage() {
  const games = [
    {
      title: 'Xadrez',
      description: 'Jogo clássico de estratégia',
      icon: ChartBarIcon,
      href: '/multiplayer/chess',
      points: '50 pts',
      comingSoon: true,
    },
    {
      title: 'Damas',
      description: 'Capture todas as peças',
      icon: UsersIcon,
      href: '/multiplayer/checkers',
      points: '30 pts',
      comingSoon: true,
    },
    {
      title: 'Gamão',
      description: 'Corrida com dados',
      icon: TrophyIcon,
      href: '/multiplayer/backgammon',
      points: '40 pts',
      comingSoon: true,
    },
    {
      title: 'Ludo',
      description: 'Leve suas peças até o fim',
      icon: UsersIcon,
      href: '/multiplayer/ludo',
      points: '25 pts',
      comingSoon: true,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Lobby Multiplayer</h1>
          <p className="text-gray-600 mt-2">Jogue contra outros jogadores em tempo real</p>
        </div>
        <Link
          href="/dashboard"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Voltar
        </Link>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center mb-4">
          <LockClosedIcon className="w-12 h-12 mr-4" />
          <div>
            <h2 className="text-2xl font-bold">Em Desenvolvimento</h2>
            <p className="text-orange-100">
              Os jogos multiplayer estão sendo desenvolvidos e estarão disponíveis em breve!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.href}
            className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 opacity-60 cursor-not-allowed relative"
          >
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              EM BREVE
            </div>

            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-4">
              <game.icon className="w-8 h-8 text-gray-400" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              {game.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4">
              {game.description}
            </p>

            {/* Points Info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {game.points}
              </span>
              <LockClosedIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-2">🎮 Próximas Funcionalidades:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Sistema de matchmaking em tempo real</li>
          <li>• Salas privadas para jogar com amigos</li>
          <li>• Chat durante as partidas</li>
          <li>• Ranking específico para multiplayer</li>
          <li>• Sistema de troféus e conquistas</li>
        </ul>
      </div>

      {/* Play Solo Games Instead */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4">Enquanto isso, que tal jogar os jogos solo?</p>
        <Link
          href="/games"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Ir para Jogos Solo
        </Link>
      </div>
    </div>
  )
}
