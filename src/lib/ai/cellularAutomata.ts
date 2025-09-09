export function makeGrid(rows: number, cols: number, seed = 0) {
  const g = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) g[r][c] = Math.random() > 0.5 ? 1 : 0;
  return g;
}

export function step(grid: number[][], rule = 'conway') {
  const rows = grid.length;
  const cols = grid[0].length;
  const out = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let alive = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = (r + dr + rows) % rows;
        const nc = (c + dc + cols) % cols;
        alive += grid[nr][nc] ? 1 : 0;
      }
      if (rule === 'conway') {
        out[r][c] = (grid[r][c] && (alive === 2 || alive === 3)) || (!grid[r][c] && alive === 3) ? 1 : 0;
      }
    }
  }
  return out;
}
