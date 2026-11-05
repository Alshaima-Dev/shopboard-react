import test from 'node:test'
import assert from 'node:assert/strict'
import { catalogMessages } from '../src/features/i18n/catalog.messages.ts'

test('all catalog request states have distinct complete translations', () => {
  const keys = ['empty', 'error', 'loading', 'noProducts', 'retry']
  for (const language of ['en', 'ar', 'tr']) {
    assert.deepEqual(Object.keys(catalogMessages[language]).sort(), keys)
    assert.equal(
      new Set(Object.values(catalogMessages[language])).size,
      keys.length,
    )
    for (const message of Object.values(catalogMessages[language]))
      assert.ok(message.trim())
  }
})
