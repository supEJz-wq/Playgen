export const validationTypes = [
  {
    category: 'Basic',
    types: [
      { label: 'Record Exists', value: 'Record Exists', icon: '✓' },
      { label: 'Record Does Not Exist', value: 'Record Does Not Exist', icon: '✗' },
      { label: 'Count Records', value: 'Count Records', icon: '#' },
      { label: 'Verify Column Value', value: 'Verify Column Value', icon: '=' },
      { label: 'Latest Record', value: 'Latest Record', icon: '🕐' },
      { label: 'Duplicate Check', value: 'Duplicate Check', icon: '⧉' },
    ],
  },
  {
    category: 'Validation',
    types: [
      { label: 'NULL Validation', value: 'NULL Validation', icon: '∅' },
      { label: 'NOT NULL Validation', value: 'NOT NULL Validation', icon: '!∅' },
    ],
  },
  {
    category: 'Advanced',
    types: [
      { label: 'JOIN Validation', value: 'JOIN Validation', icon: '⋈' },
      { label: 'Aggregate Validation', value: 'Aggregate Validation', icon: 'Σ' },
      { label: 'Date Validation', value: 'Date Validation', icon: '📅' },
      { label: 'Custom SELECT Query', value: 'Custom SELECT Query', icon: '📝' },
    ],
  },
]

export const validationCategories = [
  { label: 'Basic', value: 'Basic' },
  { label: 'Validation', value: 'Validation' },
  { label: 'Advanced', value: 'Advanced' },
]
