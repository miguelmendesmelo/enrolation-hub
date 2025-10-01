/**
 * Sliding Puzzle Game Page
 * Classic sliding puzzle with numbers
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Grid = number[][]
type Difficulty = '3x3' | '4x4'

export default function SlidingPuzzlePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('3x3')
  const [grid, setGrid] = useState<Grid>([])
  const [moves, setMoves] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [bestMoves, setBestMoves] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadBestScore()
    startNewGame(difficulty)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadBestScore = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('game_scores')
        .select('score')
        .eq('user_id', user.id)
        .eq('game_type', 'puzzle')
        .order('score', { ascending: true })
        .limit(1)
        .single()

      if (data) {
        setBestMoves(data.score)
      }
    }
  }

  const createSolvedGrid = (size: number): Grid => {
    const grid: Grid = []
    let num = 1
    for (let i = 0; i < size; i++) {
      const row: number[] = []
      for (let j = 0; j < size; j++) {
        if (i === size - 1 && j === size - 1) {
          row.push(0) // Empty space
        } else {
          row.push(num++)
        }
      }
      grid.push(row)
    }
    return grid
  }

  const shuffleGrid = (grid: Grid): Grid => {
    const newGrid = grid.map(row => [...row])
    const size = newGrid.length
    const moves = size === 3 ? 100 : 200

    // Find empty cell
    let emptyRow = size - 1
    let emptyCol = size - 1

    // Make random moves
    for (let i = 0; i < moves; i++) {
      const possibleMoves: Array<{ row: number; col: number }> = []

      if (emptyRow > 0) possibleMoves.push({ row: emptyRow - 1, col: emptyCol })
      if (emptyRow < size - 1) possibleMoves.push({ row: emptyRow + 1, col: emptyCol })
      if (emptyCol > 0) possibleMoves.push({ row: emptyRow, col: emptyCol - 1 })
      if (emptyCol < size - 1) possibleMoves.push({ row: emptyRow, col: emptyCol + 1 })

      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

      // Swap
      newGrid[emptyRow][emptyCol] = newGrid[move.row][move.col]
      newGrid[move.row][move.col] = 0
      emptyRow = move.row
      emptyCol = move.col
    }

    return newGrid
  }

  const isSolved = (grid: Grid): boolean => {
    const size = grid.length
    let expectedNum = 1

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === size - 1 && j === size - 1) {
          return grid[i][j] === 0
        }
        if (grid[i][j] !== expectedNum) {
          return false
        }
        expectedNum++
      }
    }
    return true
  }

  const startNewGame = (diff: Difficulty) => {
    const size = diff === '3x3' ? 3 : 4
    const solved = createSolvedGrid(size)
    const shuffled = shuffleGrid(solved)
    setGrid(shuffled)
    setMoves(0)
    setCompleted(false)
    setDifficulty(diff)
  }

  const findEmpty = (): { row: number; col: number } | null => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 0) {
          return { row: i, col: j }
        }
      }
    }
    return null
  }

  const handleTileClick = (row: number, col: number) => {
    if (completed) return

    const empty = findEmpty()
    if (!empty) return

    const rowDiff = Math.abs(row - empty.row)
    const colDiff = Math.abs(col - empty.col)

    // Check if tile is adjacent to empty space
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      const newGrid = grid.map(r => [...r])
      newGrid[empty.row][empty.col] = newGrid[row][col]
      newGrid[row][col] = 0
      setGrid(newGrid)
      setMoves(moves + 1)

      // Check if solved
      if (isSolved(newGrid)) {
        setCompleted(true)
        saveScore(moves + 1)
      }
    }
  }

  const saveScore = async (finalMoves: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const points = 20

      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'puzzle',
        score: finalMoves,
        points_earned: points,
        difficulty,
        completed: true,
      })

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

        // Check for badges
        if (stats.games_played + 1 === 1) {
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

  const getTileColor = (value: number) => {
    if (value === 0) return 'bg-gray-300'
    const colors = [
      'bg-blue-400',
      'bg-purple-400',
      'bg-pink-400',
      'bg-red-400',
      'bg-orange-400',
      'bg-yellow-400',
      'bg-green-400',
      'bg-teal-400',
      'bg-cyan-400',
      'bg-indigo-400',
      'bg-violet-400',
      'bg-fuchsia-400',
      'bg-rose-400',
      'bg-amber-400',
      'bg-lime-400',
      'bg-emerald-400',
    ]
    return colors[(value - 1) % colors.length]
  }

  if (grid.length === 0) {
    return <div className="text-center py-20">Carregando...</div>
  }

  const size = grid.length

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sliding Puzzle</h1>
        <button
          onClick={() => router.push('/games')}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Voltar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Difficulty Selection & Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => startNewGame('3x3')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                difficulty === '3x3'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              3x3 (Fácil)
            </button>
            <button
              onClick={() => startNewGame('4x4')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                difficulty === '4x4'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              4x4 (Difícil)
            </button>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-100 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-600">Movimentos</p>
              <p className="text-xl font-bold text-blue-600">{moves}</p>
            </div>
            {bestMoves && (
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-600">Melhor</p>
                <p className="text-xl font-bold text-gray-700">{bestMoves}</p>
              </div>
            )}
          </div>
        </div>

        {/* Puzzle Grid */}
        <div className="flex justify-center mb-6">
          <div
            className={`inline-block bg-gray-400 p-2 rounded-lg gap-2 grid`}
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
              width: size === 3 ? '320px' : '360px',
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold text-2xl transition-all duration-200 cursor-pointer hover:scale-105 ${getTileColor(
                    cell
                  )} ${cell === 0 ? 'cursor-default' : 'text-white shadow-lg'}`}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={() => startNewGame(difficulty)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Novo Jogo
          </button>
        </div>

        {/* Completed Message */}
        {completed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-green-600 mb-2">Parabéns! Você venceu!</p>
            <p className="text-gray-700 mb-4">
              Movimentos: {moves} | Pontos ganhos: 20
            </p>
            <button
              onClick={() => startNewGame(difficulty)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Jogar Novamente
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Como Jogar:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Clique em um bloco adjacente ao espaço vazio para movê-lo</li>
          <li>• Organize os números em ordem (1, 2, 3...)</li>
          <li>• O espaço vazio deve ficar no canto inferior direito</li>
          <li>• 3x3: números 1-8 | 4x4: números 1-15</li>
          <li>• Complete o puzzle para ganhar 20 pontos!</li>
        </ul>
      </div>
    </div>
  )
}
