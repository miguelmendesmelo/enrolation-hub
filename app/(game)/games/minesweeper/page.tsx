/**
 * Minesweeper Game Page
 */

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  initializeGrid,
  placeMines,
  revealCell,
  toggleFlag,
  checkWin,
  revealAllMines,
  getMineCount,
  countFlags,
  type Grid,
  type Difficulty,
} from '@/lib/gameLogic/minesweeper'
import { FlagIcon, FaceFrownIcon, FaceSmileIcon } from '@heroicons/react/24/solid'

export default function MinesweeperPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [grid, setGrid] = useState<Grid>(initializeGrid('easy'))
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [flagMode, setFlagMode] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const startNewGame = (diff: Difficulty) => {
    setGrid(initializeGrid(diff))
    setDifficulty(diff)
    setGameStarted(false)
    setGameOver(false)
    setWon(false)
    setFlagMode(false)
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || won || grid[row][col].isRevealed) return

    if (flagMode) {
      setGrid(toggleFlag(grid, row, col))
      return
    }

    if (grid[row][col].isFlagged) return

    // First click: place mines
    if (!gameStarted) {
      const newGrid = placeMines(grid, difficulty, row, col)
      setGrid(newGrid)
      setGameStarted(true)
      const revealed = revealCell(newGrid, row, col)
      setGrid(revealed)

      if (checkWin(revealed, difficulty)) {
        setWon(true)
        saveScore(true)
      }
      return
    }

    // Check if clicked mine
    if (grid[row][col].isMine) {
      setGameOver(true)
      setGrid(revealAllMines(grid))
      saveScore(false)
      return
    }

    // Reveal cell
    const newGrid = revealCell(grid, row, col)
    setGrid(newGrid)

    if (checkWin(newGrid, difficulty)) {
      setWon(true)
      saveScore(true)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (!gameOver && !won && !grid[row][col].isRevealed) {
      setGrid(toggleFlag(grid, row, col))
    }
  }

  const saveScore = async (didWin: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const points = didWin ? { easy: 30, medium: 40, hard: 50 }[difficulty] : 0

      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'minesweeper',
        score: points,
        points_earned: points,
        difficulty,
        completed: didWin,
      })

      if (didWin) {
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
              games_won: stats.games_won + 1,
            })
            .eq('user_id', user.id)
        }
      }
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const getCellContent = (cell: typeof grid[0][0]) => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? '🚩' : ''
    }
    if (cell.isMine) return '💣'
    if (cell.neighborMines === 0) return ''
    return cell.neighborMines
  }

  const getCellClass = (cell: typeof grid[0][0]) => {
    const colors = ['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-600', 'text-yellow-600', 'text-pink-600', 'text-gray-600', 'text-black']

    return `
      w-8 h-8 flex items-center justify-center text-sm font-bold border border-gray-400 cursor-pointer transition-colors
      ${cell.isRevealed ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-300'}
      ${cell.isMine && cell.isRevealed ? 'bg-red-500' : ''}
      ${cell.neighborMines > 0 ? colors[cell.neighborMines] : ''}
    `
  }

  const mineCount = getMineCount(difficulty)
  const flagCount = countFlags(grid)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Campo Minado</h1>
        <button onClick={() => router.push('/games')} className="text-orange-600 hover:text-orange-700 font-medium">
          ← Voltar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button onClick={() => startNewGame('easy')} className={`px-4 py-2 rounded-lg font-medium ${difficulty === 'easy' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
              Fácil (8x8)
            </button>
            <button onClick={() => startNewGame('medium')} className={`px-4 py-2 rounded-lg font-medium ${difficulty === 'medium' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
              Médio (12x12)
            </button>
            <button onClick={() => startNewGame('hard')} className={`px-4 py-2 rounded-lg font-medium ${difficulty === 'hard' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
              Difícil (16x16)
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-gray-700">💣 {mineCount - flagCount}</div>
            <button
              onClick={() => setFlagMode(!flagMode)}
              className={`p-2 rounded-lg transition-colors ${flagMode ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            >
              <FlagIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-6 overflow-auto">
          <div className="inline-block">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClass(cell)}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                  >
                    {getCellContent(cell)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {gameOver && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FaceFrownIcon className="w-16 h-16 text-red-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-red-600 mb-2">Boom! Game Over</p>
            <button onClick={() => startNewGame(difficulty)} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg">
              Tentar Novamente
            </button>
          </div>
        )}

        {won && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <FaceSmileIcon className="w-16 h-16 text-green-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-green-600 mb-2">🎉 Você Venceu!</p>
            <p className="text-gray-700 mb-4">Pontos: {({ easy: 30, medium: 40, hard: 50 })[difficulty]}</p>
            <button onClick={() => startNewGame(difficulty)} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg">
              Novo Jogo
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Como Jogar:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Clique para revelar células</li>
          <li>• Botão direito ou modo bandeira para marcar minas</li>
          <li>• Números mostram quantas minas estão ao redor</li>
          <li>• Revele todas as células sem minas para vencer!</li>
        </ul>
      </div>
    </div>
  )
}
