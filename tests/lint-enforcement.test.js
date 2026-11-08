import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import configuration from '../lint-staged.config.js'

test('the existing pre-commit lint command rejects explicit any and accepts unknown without staging or committing', () => {
  const root = fileURLToPath(new URL('../', import.meta.url))
  const commands = configuration['*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}']
  assert.equal(commands[0], 'oxlint --max-warnings=0')
  const hook = fs.readFileSync(path.join(root, '.husky/pre-commit'), 'utf8')
  assert.match(hook, /set -e\s+npm run lint:staged/)
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
  )
  assert.equal(pkg.scripts['lint:staged'], 'lint-staged --fail-on-changes')
  const directory = fs.mkdtempSync(path.join(root, 'tests/lint-probe-'))
  const file = path.join(directory, 'probe.ts')
  assert.ok(
    path.resolve(directory).startsWith(path.resolve(root, 'tests') + path.sep),
  )
  try {
    const run = (source) => {
      fs.writeFileSync(file, source)
      return spawnSync(
        process.execPath,
        [
          path.join(root, 'node_modules/oxlint/bin/oxlint'),
          ...commands[0].split(' ').slice(1),
          file,
        ],
        { cwd: root, encoding: 'utf8' },
      )
    }
    const rejected = run('export const value: any = 1\n')
    assert.equal(rejected.status, 1, rejected.stdout + rejected.stderr)
    assert.match(rejected.stdout + rejected.stderr, /no-explicit-any/)
    const accepted = run('export const value: unknown = 1\n')
    assert.equal(accepted.status, 0, accepted.stdout + accepted.stderr)
  } finally {
    if (fs.existsSync(file)) fs.unlinkSync(file)
    fs.rmdirSync(directory)
  }
})
