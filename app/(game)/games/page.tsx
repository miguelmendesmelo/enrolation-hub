/**
 * Games Index Page
 * Shows all available single player games
 */

import Link from 'next/link'
import {
  PuzzlePieceIcon,
  CalculatorIcon,
  BoltIcon,
  PhotoIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function GamesPage() {
  const games = [
    {
      title: '2048',
      description: 'Combine números até 2048',
      icon: CalculatorIcon,
      href: '/games/2048',
      points: '1 pt / 100',
      color: 'orange',
    },
    {
      title: 'Sudoku',
      description: 'Resolva puzzles de lógica',
      icon: PuzzlePieceIcon,
      href: '/games/sudoku',
      points: '10-50 pts',
      color: 'blue',
    },
    {
      title: 'Campo Minado',
      description: 'Encontre todas as minas',
      icon: BoltIcon,
      href: '/games/minesweeper',
      points: '30+ pts',
      color: 'red',
    },
    {
      title: 'Quebra-Cabeça',
      description: 'Monte a imagem deslizante',
      icon: PhotoIcon,
      href: '/games/puzzle',
      points: '20 pts',
      color: 'purple',
    },
    {
      title: 'Blackjack',
      description: 'Jogue contra a casa (21)',
      icon: HeartIcon,
      href: '/games/blackjack',
      points: '5-10 pts',
      color: 'green',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Jogos Solo</h1>
        <Link
          href="/dashboard"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link key={game.href} href={game.href}>
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-200 cursor-pointer">
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mb-4">
                <game.icon className="w-8 h-8 text-orange-500" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {game.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">
                {game.description}
              </p>

              {/* Points Info */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  {game.points}
                </span>
                <span className="text-orange-500">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-orange-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Como Ganhar Pontos:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Complete os jogos para ganhar pontos</li>
          <li>• Pontos são adicionados automaticamente ao ranking</li>
          <li>• Quanto melhor sua performance, mais pontos você ganha</li>
          <li>• Compete com seus colegas no ranking geral!</li>
        </ul>
      </div>
    </div>
  )
}
