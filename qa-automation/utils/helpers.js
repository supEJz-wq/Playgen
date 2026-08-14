export function readTestData(file) {
  const path = require('path');
  const fs = require('fs');
  const fullPath = path.join(process.cwd(), 'test-data', file);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw);
}

export function generateRandomEmail() {
  return `test.user.${Date.now()}@example.com`;
}
