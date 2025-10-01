/**
 * 2048 Game Page
 * Classic 2048 sliding puzzle game
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  initializeGrid,
  move,
  addRandomTile,
  isGameOver,
  hasWon,
  type Grid,
  type Direction,
} from '@/lib/gameLogic/2048'
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

export default function Game2048Page() {
  const [grid, setGrid] = useState<Grid>(initializeGrid())
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const loadBestScore = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('game_scores')
        .select('score')
        .eq('user_id', user.id)
        .eq('game_type', '2048')
        .order('score', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setBestScore(data.score)
      }
    }
  }

  const makeMove = (direction: Direction) => {
    if (gameOver || won) return

    const { grid: newGrid, score: moveScore, moved } = move(grid, direction)

    if (!moved) return

    addRandomTile(newGrid)
    setGrid(newGrid)
    const newScore = score + moveScore
    setScore(newScore)

    // Check win condition
    if (hasWon(newGrid) && !won) {
      setWon(true)
      saveScore(newScore)
    }

    // Check game over
    if (isGameOver(newGrid)) {
      setGameOver(true)
      saveScore(newScore)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    let direction: Direction | null = null

    switch (e.key) {
      case 'ArrowLeft':
        direction = 'left'
        break
      case 'ArrowRight':
        direction = 'right'
        break
      case 'ArrowUp':
        direction = 'up'
        break
      case 'ArrowDown':
        direction = 'down'
        break
      default:
        return
    }

    if (direction) {
      e.preventDefault()
      makeMove(direction)
    }
  }

  const saveScore = async (finalScore: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Calculate points (1 point per 100 score)
      const points = Math.floor(finalScore / 100)

      // Save score
      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: '2048',
        score: finalScore,
        points_earned: points,
        completed: won,
      })

      // Update user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (stats) {
        await supabase
          .from('user_stats')
          .update({
            total_points: stats.total_points + points,
            games_played: stats.games_played + 1,
            games_won: won ? stats.games_won + 1 : stats.games_won,
          })
          .eq('user_id', user.id)

        // Check for badges
        if (stats.games_played + 1 === 1 && won) {
          await supabase.from('user_badges').upsert({
            user_id: user.id,
            badge_type: 'first_win',
          })
        }

        if (stats.games_played + 1 >= 10) {
          await supabase.from('user_badges').upsert({
            user_id: user.id,
            badge_type: '10_games',
          })
        }

        if (stats.total_points + points >= 100) {
          await supabase.from('user_badges').upsert({
            user_id: user.id,
            badge_type: '100_points',
          })
        }
      }
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const restartGame = () => {
    setGrid(initializeGrid())
    setScore(0)
    setGameOver(false)
    setWon(false)
  }

  useEffect(() => {
    loadBestScore()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: 'bg-gray-200',
      2: 'bg-orange-100 text-gray-800',
      4: 'bg-orange-200 text-gray-800',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-orange-600 text-white',
      128: 'bg-yellow-300 text-white',
      256: 'bg-yellow-400 text-white',
      512: 'bg-yellow-500 text-white',
      1024: 'bg-yellow-600 text-white',
      2048: 'bg-green-500 text-white',
      4096: 'bg-green-600 text-white',
    }
    return colors[value] || 'bg-purple-500 text-white'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">2048</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Voltar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Score Display */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-orange-100 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600">Pontuação</p>
            <p className="text-2xl font-bold text-orange-600">{score}</p>
          </div>
          <div className="bg-gray-100 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600">Melhor</p>
            <p className="text-2xl font-bold text-gray-700">{Math.max(bestScore, score)}</p>
          </div>
          <button
            onClick={restartGame}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Novo Jogo
          </button>
        </div>

        {/* Game Grid */}
        <div className="bg-gray-300 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-4 gap-4">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold text-2xl transition-all duration-200 ${getTileColor(
                    cell
                  )}`}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 text-center mb-4">
            Use as setas do teclado ou os botões abaixo para jogar
          </p>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div></div>
            <button
              onClick={() => makeMove('up')}
              className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg transition-colors"
              disabled={gameOver || won}
            >
              <ArrowUpIcon className="w-6 h-6 mx-auto" />
            </button>
            <div></div>
            <button
              onClick={() => makeMove('left')}
              className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg transition-colors"
              disabled={gameOver || won}
            >
              <ArrowLeftIcon className="w-6 h-6 mx-auto" />
            </button>
            <button
              onClick={() => makeMove('down')}
              className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg transition-colors"
              disabled={gameOver || won}
            >
              <ArrowDownIcon className="w-6 h-6 mx-auto" />
            </button>
            <button
              onClick={() => makeMove('right')}
              className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg transition-colors"
              disabled={gameOver || won}
            >
              <ArrowRightIcon className="w-6 h-6 mx-auto" />
            </button>
          </div>
        </div>

        {/* Game Over / Win Messages */}
        {gameOver && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-red-600 mb-2">Game Over!</p>
            <p className="text-gray-700 mb-4">
              Pontuação Final: {score} | Pontos Ganhos: {Math.floor(score / 100)}
            </p>
            <button
              onClick={restartGame}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Jogar Novamente
            </button>
          </div>
        )}

        {won && !gameOver && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-green-600 mb-2">🎉 Você Venceu!</p>
            <p className="text-gray-700 mb-4">
              Pontuação: {score} | Pontos Ganhos: {Math.floor(score / 100)}
            </p>
            <button
              onClick={restartGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Jogar Novamente
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-orange-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Como Jogar:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Use as setas para mover os blocos</li>
          <li>• Quando dois blocos com o mesmo número se tocam, eles se fundem</li>
          <li>• Objetivo: criar um bloco com o número 2048</li>
          <li>• Pontuação: cada 100 pontos = 1pt no ranking</li>
        </ul>
      </div>
    </div>
  )
}
