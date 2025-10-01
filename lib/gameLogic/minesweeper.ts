/**
 * Minesweeper Game Logic
 * Classic mine detection game
 */

export type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export type Grid = Cell[][]
export type Difficulty = 'easy' | 'medium' | 'hard'

const DIFFICULTY_CONFIG = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 25 },
  hard: { rows: 16, cols: 16, mines: 50 },
}

// Initialize empty grid
export function initializeGrid(difficulty: Difficulty): Grid {
  const { rows, cols } = DIFFICULTY_CONFIG[difficulty]
  const grid: Grid = []

  for (let row = 0; row < rows; row++) {
    grid[row] = []
    for (let col = 0; col < cols; col++) {
      grid[row][col] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }
    }
  }

  return grid
}

// Place mines randomly
export function placeMines(grid: Grid, difficulty: Difficulty, firstRow: number, firstCol: number): Grid {
  const { rows, cols, mines } = DIFFICULTY_CONFIG[difficulty]
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })))

  let placed = 0
  while (placed < mines) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)

    // Don't place mine on first click or adjacent cells
    const isFirstClick = row === firstRow && col === firstCol
    const isAdjacent = Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1

    if (!newGrid[row][col].isMine && !isFirstClick && !isAdjacent) {
      newGrid[row][col].isMine = true
      placed++
    }
  }

  // Calculate neighbor mines
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].neighborMines = countNeighborMines(newGrid, row, col)
      }
    }
  }

  return newGrid
}

// Count mines in neighboring cells
function countNeighborMines(grid: Grid, row: number, col: number): number {
  let count = 0
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ]

  for (const [dr, dc] of directions) {
    const newRow = row + dr
    const newCol = col + dc
    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      grid[newRow][newCol].isMine
    ) {
      count++
    }
  }

  return count
}

// Reveal cell (with flood fill for empty cells)
export function revealCell(grid: Grid, row: number, col: number): Grid {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })))

  if (
    row < 0 ||
    row >= newGrid.length ||
    col < 0 ||
    col >= newGrid[0].length ||
    newGrid[row][col].isRevealed ||
    newGrid[row][col].isFlagged
  ) {
    return newGrid
  }

  newGrid[row][col].isRevealed = true

  // If cell has no neighboring mines, reveal neighbors recursively
  if (newGrid[row][col].neighborMines === 0 && !newGrid[row][col].isMine) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ]

    for (const [dr, dc] of directions) {
      const result = revealCell(newGrid, row + dr, col + dc)
      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[0].length; c++) {
          newGrid[r][c] = result[r][c]
        }
      }
    }
  }

  return newGrid
}

// Toggle flag on cell
export function toggleFlag(grid: Grid, row: number, col: number): Grid {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })))

  if (!newGrid[row][col].isRevealed) {
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged
  }

  return newGrid
}

// Check if player won
export function checkWin(grid: Grid, difficulty: Difficulty): boolean {
  const { mines } = DIFFICULTY_CONFIG[difficulty]
  let revealedCount = 0
  let totalCells = grid.length * grid[0].length

  for (const row of grid) {
    for (const cell of row) {
      if (cell.isRevealed && !cell.isMine) {
        revealedCount++
      }
    }
  }

  return revealedCount === totalCells - mines
}

// Reveal all mines (when game over)
export function revealAllMines(grid: Grid): Grid {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed,
    }))
  )
}

// Get grid dimensions for difficulty
export function getGridDimensions(difficulty: Difficulty): { rows: number; cols: number } {
  const { rows, cols } = DIFFICULTY_CONFIG[difficulty]
  return { rows, cols }
}

// Get mine count for difficulty
export function getMineCount(difficulty: Difficulty): number {
  return DIFFICULTY_CONFIG[difficulty].mines
}

// Count flagged cells
export function countFlags(grid: Grid): number {
  let count = 0
  for (const row of grid) {
    for (const cell of row) {
      if (cell.isFlagged) count++
    }
  }
  return count
}
