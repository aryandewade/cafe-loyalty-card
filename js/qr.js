/* ==========================================================================
   ATELIER QR CODE & MEMBER PASS RENDERER
   Generates crisp, responsive SVG QR matrix with centered brand monogram
   ========================================================================== */

function generateAtelierQR(content, size = 180) {
  // Generate deterministic pattern based on content hash
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }

  const matrixSize = 25; // 25x25 QR matrix
  const moduleSize = size / matrixSize;
  const grid = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(false));

  // 1. Draw 3 Standard Position Detection Patterns (Corners)
  function drawCorner(startX, startY) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (isBorder || isCenter) {
          grid[startY + r][startX + c] = true;
        }
      }
    }
  }

  drawCorner(0, 0); // Top-Left
  drawCorner(matrixSize - 7, 0); // Top-Right
  drawCorner(0, matrixSize - 7); // Bottom-Left

  // 2. Timing Patterns
  for (let i = 8; i < matrixSize - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // 3. Data modules with pseudo-random seed from content
  let seed = Math.abs(hash);
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip corners
      if ((r < 8 && c < 8) || (r < 8 && c >= matrixSize - 8) || (r >= matrixSize - 8 && c < 8)) {
        continue;
      }
      // Skip center brand mark zone
      if (r >= 10 && r <= 14 && c >= 10 && c <= 14) {
        continue;
      }
      seed = (seed * 9301 + 49297) % 233280;
      grid[r][c] = (seed / 233280) > 0.48;
    }
  }

  // Build SVG Path
  let paths = '';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (grid[r][c]) {
        const x = (c * moduleSize).toFixed(1);
        const y = (r * moduleSize).toFixed(1);
        const w = (moduleSize * 0.94).toFixed(1);
        const h = (moduleSize * 0.94).toFixed(1);
        // Rounded modules for a sleek modern look
        paths += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="#1A1310" />`;
      }
    }
  }

  // Center Badge (Café Monogram)
  const centerSize = moduleSize * 5.2;
  const centerPos = (size - centerSize) / 2;
  const centerSvg = `
    <rect x="${centerPos}" y="${centerPos}" width="${centerSize}" height="${centerSize}" rx="8" fill="#FDFBF7" stroke="#C89D4B" stroke-width="1.5" />
    <text x="${size/2}" y="${size/2 + 4.5}" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="${centerSize * 0.5}" font-weight="700" fill="#1A1310">A</text>
  `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="geometricPrecision">
      ${paths}
      ${centerSvg}
    </svg>
  `;
}

window.generateAtelierQR = generateAtelierQR;
