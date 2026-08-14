# PlayGen QA Automation

Playwright + JavaScript + Page Object Model (POM)

## Setup
1. Copy `.env.example` to `.env` and update values
2. Run `npm install`
3. Run `npx playwright install`
4. Execute tests: `npm test`

## Structure
- `pages/` — Page Object classes
- `tests/` — Test specs
- `utils/` — Helpers, fixtures, custom assertions
- `test-data/` — JSON/CSV test data
