import { writeFileSync } from 'fs'

const defaults = {
  name: (index) => `Palette ${index + 1}`,
  type: 'regular',
  colours: ['#FF0000', '#00FF00', '#0000FF'],
}

/**
 * Create a temporary TPS file with the given palette specifications.
 * Uses Playwright's testInfo.outputPath for automatic cleanup.
 *
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test info for output path
 * @param {number|Array<object>} palettes - Number of palettes (uses defaults)
 *   or array of palette objects with optional { name, type, colours } fields.
 * @returns {{ path: string, palettes: Array<{ name: string, type: string, colours: string[] }> }}
 *
 * @example
 * const tpsFile = createTpsFile(testInfo, 3)
 * const tpsFile = createTpsFile(testInfo, [
 *   { name: 'Warm', colours: ['#FF0000'] },
 *   { name: 'Cool' },
 * ])
 */
export function createTpsFile(testInfo, palettes) {
  const specs =
    typeof palettes === 'number'
      ? Array.from({ length: palettes }, (_, i) => ({
          name: defaults.name(i),
          type: defaults.type,
          colours: defaults.colours,
        }))
      : palettes.map((p, i) => ({
          name: p.name ?? defaults.name(i),
          type: p.type ?? defaults.type,
          colours: p.colours ?? defaults.colours,
        }))

  const xml = [
    `<?xml version='1.0'?>`,
    `<workbook>`,
    `\t<preferences>`,
    ...specs.flatMap((p) => [
      `\t\t<color-palette name="${escapeXml(p.name)}" type="${p.type}">`,
      ...p.colours.map((c) => `\t\t\t<color>${c}</color>`),
      `\t\t</color-palette>`,
    ]),
    `\t</preferences>`,
    `</workbook>`,
  ].join('\n')

  // testInfo.outputPath() creates files in a directory unique per test + project + retry,
  // so 'test.tps' won't collide across parallel test runs.
  const filePath = testInfo.outputPath('test.tps')
  writeFileSync(filePath, xml, 'utf-8')
  return { path: filePath, palettes: specs }
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
