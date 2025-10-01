/**
 * Sudoku Game Page
 * Classic 9x9 Sudoku puzzle game
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  generatePuzzle,
  isValidPlacement,
  isPuzzleComplete,
  checkSolution,
  getHint,
  type SudokuGrid,
  type Difficulty,
} from '@/lib/gameLogic/sudoku'
import { LightBulbIcon } from '@heroicons/react/24/outline'

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [puzzle, setPuzzle] = useState<SudokuGrid>([])
  const [solution, setSolution] = useState<SudokuGrid>([])
  const [grid, setGrid] = useState<SudokuGrid>([])
  const [initialGrid, setInitialGrid] = useState<SudokuGrid>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [completed, setCompleted] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    startNewGame(difficulty)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startNewGame = (diff: Difficulty) => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(diff)
    setPuzzle(newPuzzle)
    setSolution(newSolution)
    setGrid(newPuzzle.map(row => [...row]))
    setInitialGrid(newPuzzle.map(row => [...row]))
    setSelectedCell(null)
    setErrors(new Set())
    setCompleted(false)
    setHintsUsed(0)
    setDifficulty(diff)
  }

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] === 0 && !completed) {
      setSelectedCell({ row, col })
    }
  }

  const handleNumberInput = (num: number) => {
    if (!selectedCell || completed) return

    const { row, col } = selectedCell
    if (initialGrid[row][col] !== 0) return

    const newGrid = grid.map(r => [...r])
    newGrid[row][col] = num

    // Check if placement creates error
    const errorKey = `${row}-${col}`
    const newErrors = new Set(errors)

    if (!isValidPlacement(newGrid, row, col, num)) {
      newErrors.add(errorKey)
    } else {
      newErrors.delete(errorKey)
    }

    setGrid(newGrid)
    setErrors(newErrors)

    // Check if puzzle is complete
    if (isPuzzleComplete(newGrid) && checkSolution(newGrid, solution)) {
      setCompleted(true)
      saveScore()
    }
  }

  const handleClear = () => {
    if (!selectedCell || completed) return
    const { row, col } = selectedCell
    if (initialGrid[row][col] !== 0) return

    const newGrid = grid.map(r => [...r])
    newGrid[row][col] = 0
    setGrid(newGrid)

    const errorKey = `${row}-${col}`
    const newErrors = new Set(errors)
    newErrors.delete(errorKey)
    setErrors(newErrors)
  }

  const handleHint = () => {
    if (completed) return
    const hint = getHint(grid, solution)
    if (hint) {
      const newGrid = grid.map(r => [...r])
      newGrid[hint.row][hint.col] = hint.value
      setGrid(newGrid)
      setHintsUsed(hintsUsed + 1)
      setSelectedCell(null)

      if (isPuzzleComplete(newGrid)) {
        setCompleted(true)
        saveScore()
      }
    }
  }

  const saveScore = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Calculate points based on difficulty and hints used
      const basePoints = {
        easy: 10,
        medium: 30,
        hard: 50,
      }[difficulty]

      const penaltyPoints = Math.min(hintsUsed * 2, basePoints - 5)
      const points = Math.max(5, basePoints - penaltyPoints)

      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'sudoku',
        score: points,
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
      }
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const getCellClass = (row: number, col: number) => {
    const isInitial = initialGrid[row][col] !== 0
    const isSelected = selectedCell?.row === row && selectedCell?.col === col
    const hasError = errors.has(`${row}-${col}`)
    const isInSameRow = selectedCell?.row === row
    const isInSameCol = selectedCell?.col === col
    const isInSameBox =
      selectedCell &&
      Math.floor(row / 3) === Math.floor(selectedCell.row / 3) &&
      Math.floor(col / 3) === Math.floor(selectedCell.col / 3)

    return `
      w-12 h-12 flex items-center justify-center text-lg font-semibold cursor-pointer transition-colors
      ${isInitial ? 'bg-gray-200 text-gray-800 font-bold' : 'bg-white hover:bg-blue-50'}
      ${isSelected ? 'bg-blue-200 ring-2 ring-blue-500' : ''}
      ${hasError ? 'bg-red-100 text-red-600' : ''}
      ${!isSelected && (isInSameRow || isInSameCol || isInSameBox) ? 'bg-blue-50' : ''}
      ${col % 3 === 2 && col !== 8 ? 'border-r-2 border-gray-800' : 'border-r border-gray-300'}
      ${row % 3 === 2 && row !== 8 ? 'border-b-2 border-gray-800' : 'border-b border-gray-300'}
    `
  }

  if (puzzle.length === 0) {
    return <div className="text-center py-20">Carregando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sudoku</h1>
        <button
          onClick={() => router.push('/games')}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Voltar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Difficulty Selection */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => startNewGame('easy')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                difficulty === 'easy'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Fácil
            </button>
            <button
              onClick={() => startNewGame('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                difficulty === 'medium'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Médio
            </button>
            <button
              onClick={() => startNewGame('hard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                difficulty === 'hard'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Difícil
            </button>
          </div>
          <button
            onClick={handleHint}
            disabled={completed}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LightBulbIcon className="w-5 h-5" />
            Dica ({hintsUsed})
          </button>
        </div>

        {/* Sudoku Grid */}
        <div className="flex justify-center mb-6">
          <div className="inline-block border-2 border-gray-800">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClass(rowIndex, colIndex)}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell !== 0 && cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Number Input */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              disabled={!selectedCell || completed}
              className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={!selectedCell || completed}
            className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        {/* Completed Message */}
        {completed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-green-600 mb-2">🎉 Parabéns!</p>
            <p className="text-gray-700 mb-4">
              Dicas usadas: {hintsUsed} | Pontos ganhos: {Math.max(5, ({ easy: 10, medium: 30, hard: 50 }[difficulty]) - Math.min(hintsUsed * 2, ({ easy: 10, medium: 30, hard: 50 }[difficulty]) - 5))}
            </p>
            <button
              onClick={() => startNewGame(difficulty)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Novo Jogo
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Como Jogar:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Clique em uma célula vazia e escolha um número</li>
          <li>• Cada linha, coluna e quadrado 3x3 deve ter os números 1-9</li>
          <li>• Use dicas se ficar preso (mas perde pontos!)</li>
          <li>• Fácil: 10pts | Médio: 30pts | Difícil: 50pts</li>
        </ul>
      </div>
    </div>
  )
}
