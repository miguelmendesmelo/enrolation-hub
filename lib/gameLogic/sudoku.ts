/**
 * Sudoku Game Logic
 * Generate and validate Sudoku puzzles
 */

export type SudokuGrid = number[][]
export type Difficulty = 'easy' | 'medium' | 'hard'

// Generate a complete valid Sudoku grid
function generateCompleteGrid(): SudokuGrid {
  const grid: SudokuGrid = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0))

  fillGrid(grid)
  return grid
}

// Fill grid using backtracking
function fillGrid(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])
        for (const num of numbers) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num
            if (fillGrid(grid)) {
              return true
            }
            grid[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

// Check if a number can be placed at position
export function isValidPlacement(
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false
  }

  // Check 3x3 box
  const startRow = row - (row % 3)
  const startCol = col - (col % 3)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false
    }
  }

  return true
}

// Generate a puzzle by removing numbers from complete grid
export function generatePuzzle(difficulty: Difficulty): {
  puzzle: SudokuGrid
  solution: SudokuGrid
} {
  const solution = generateCompleteGrid()
  const puzzle = solution.map(row => [...row])

  // Number of cells to remove based on difficulty
  const cellsToRemove = {
    easy: 40,
    medium: 50,
    hard: 60,
  }[difficulty]

  let removed = 0
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0
      removed++
    }
  }

  return { puzzle, solution }
}

// Check if puzzle is complete and correct
export function isPuzzleComplete(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) return false
    }
  }
  return true
}

// Check if current grid state is valid (no conflicts)
export function isGridValid(grid: SudokuGrid): boolean {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const nums = grid[row].filter(n => n !== 0)
    if (new Set(nums).size !== nums.length) return false
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const nums = []
    for (let row = 0; row < 9; row++) {
      if (grid[row][col] !== 0) nums.push(grid[row][col])
    }
    if (new Set(nums).size !== nums.length) return false
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const nums = []
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const val = grid[boxRow * 3 + i][boxCol * 3 + j]
          if (val !== 0) nums.push(val)
        }
      }
      if (new Set(nums).size !== nums.length) return false
    }
  }

  return true
}

// Check if puzzle matches solution
export function checkSolution(grid: SudokuGrid, solution: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== solution[row][col]) return false
    }
  }
  return true
}

// Helper: Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get hint: find next correct cell
export function getHint(
  grid: SudokuGrid,
  solution: SudokuGrid
): { row: number; col: number; value: number } | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return { row, col, value: solution[row][col] }
      }
    }
  }
  return null
}
