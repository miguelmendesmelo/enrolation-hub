/**
 * 2048 Game Logic
 * Core game mechanics for the 2048 puzzle game
 */

export type Grid = number[][]
export type Direction = 'up' | 'down' | 'left' | 'right'

// Initialize empty 4x4 grid
export function initializeGrid(): Grid {
  const grid: Grid = Array(4)
    .fill(null)
    .map(() => Array(4).fill(0))

  // Add two initial tiles
  addRandomTile(grid)
  addRandomTile(grid)

  return grid
}

// Add a random tile (2 or 4) to an empty cell
export function addRandomTile(grid: Grid): boolean {
  const emptyCells: [number, number][] = []

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push([row, col])
      }
    }
  }

  if (emptyCells.length === 0) return false

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  grid[row][col] = Math.random() < 0.9 ? 2 : 4

  return true
}

// Move tiles in a direction
export function move(grid: Grid, direction: Direction): { grid: Grid; score: number; moved: boolean } {
  const newGrid = grid.map(row => [...row])
  let score = 0
  let moved = false

  switch (direction) {
    case 'left':
      for (let row = 0; row < 4; row++) {
        const { line, lineScore, lineMoved } = mergeLine(newGrid[row])
        newGrid[row] = line
        score += lineScore
        moved = moved || lineMoved
      }
      break

    case 'right':
      for (let row = 0; row < 4; row++) {
        const reversed = newGrid[row].reverse()
        const { line, lineScore, lineMoved } = mergeLine(reversed)
        newGrid[row] = line.reverse()
        score += lineScore
        moved = moved || lineMoved
      }
      break

    case 'up':
      for (let col = 0; col < 4; col++) {
        const column = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]]
        const { line, lineScore, lineMoved } = mergeLine(column)
        for (let row = 0; row < 4; row++) {
          newGrid[row][col] = line[row]
        }
        score += lineScore
        moved = moved || lineMoved
      }
      break

    case 'down':
      for (let col = 0; col < 4; col++) {
        const column = [newGrid[3][col], newGrid[2][col], newGrid[1][col], newGrid[0][col]]
        const { line, lineScore, lineMoved } = mergeLine(column)
        for (let row = 0; row < 4; row++) {
          newGrid[3 - row][col] = line[row]
        }
        score += lineScore
        moved = moved || lineMoved
      }
      break
  }

  return { grid: newGrid, score, moved }
}

// Merge a single line (row or column)
function mergeLine(line: number[]): { line: number[]; lineScore: number; lineMoved: boolean } {
  const original = [...line]

  // Remove zeros
  const nonZero = line.filter(x => x !== 0)

  let lineScore = 0
  const merged: number[] = []

  let i = 0
  while (i < nonZero.length) {
    if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
      const mergedValue = nonZero[i] * 2
      merged.push(mergedValue)
      lineScore += mergedValue
      i += 2
    } else {
      merged.push(nonZero[i])
      i++
    }
  }

  // Pad with zeros
  while (merged.length < 4) {
    merged.push(0)
  }

  const lineMoved = !arraysEqual(original, merged)

  return { line: merged, lineScore, lineMoved }
}

// Check if game is over (no valid moves)
export function isGameOver(grid: Grid): boolean {
  // Check for empty cells
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0) return false
    }
  }

  // Check for possible merges horizontally
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      if (grid[row][col] === grid[row][col + 1]) return false
    }
  }

  // Check for possible merges vertically
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 3; row++) {
      if (grid[row][col] === grid[row + 1][col]) return false
    }
  }

  return true
}

// Check if player won (has 2048 tile)
export function hasWon(grid: Grid): boolean {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] >= 2048) return true
    }
  }
  return false
}

// Helper function to compare arrays
function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((val, index) => val === b[index])
}
