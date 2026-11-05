export default {
  '*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': [
    'oxlint --max-warnings=0',
    'prettier --check',
  ],
  '*.{css,json,html,md}': 'prettier --check',
}
