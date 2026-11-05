import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { products } from '../src/features/products/products.data.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(fs.readFileSync(new URL('../docs/foundations-manifest.json', import.meta.url), 'utf8'))

test('preserved source, documentation, CSS, and assets match recorded hashes', () => {
  assert.equal(manifest.length, 34)
  for (const entry of manifest) {
    const data = fs.readFileSync(path.join(root, entry.target))
    assert.equal(createHash('sha256').update(data).digest('hex'), entry.sha256, entry.target)
  }
})

test('the twelve-product catalog has unique IDs and existing local image assets', () => {
  assert.equal(products.length, 12)
  assert.equal(new Set(products.map(product => product.id)).size, 12)
  for (const product of products) {
    assert.ok(fs.statSync(path.join(root, 'public', product.image)).isFile(), product.image)
  }
  assert.ok(fs.statSync(path.join(root, 'public/images/products/fallback.svg')).isFile())
})

test('all foundation imports resolve without cycles and respect DOM/storage boundaries', () => {
  const sources = new Map(manifest.filter(entry => entry.target.endsWith('.ts')).map(entry => {
    const file = path.join(root, entry.target)
    return [file, fs.readFileSync(file, 'utf8')]
  }))
  const visiting = new Set()
  const visited = new Set()
  function visit(file) {
    assert.ok(sources.has(file), `Unresolved foundation: ${file}`)
    assert.ok(!visiting.has(file), `Circular dependency: ${file}`)
    if (visited.has(file)) return
    visiting.add(file)
    const source = sources.get(file)
    assert.doesNotMatch(source, /\b(?:document|window)\./)
    if (!file.endsWith('.state.ts')) assert.doesNotMatch(source, /\blocalStorage\b/)
    for (const match of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+\.ts)['"]/g)) {
      visit(path.resolve(path.dirname(file), match[1]))
    }
    visiting.delete(file)
    visited.add(file)
  }
  for (const file of sources.keys()) visit(file)
  assert.equal(visited.size, sources.size)
})
