export function getExpectedResultText(form) {
  switch (form.validationType) {
    case 'Record Exists':
      return 'One or more records should exist.';
    case 'Record Does Not Exist':
      return 'No records should exist.';
    case 'Count Records':
      return form.expectedCount
        ? `Count should equal ${form.expectedCount}.`
        : 'Verify the count matches expectations.';
    case 'Verify Column Value':
      return form.expectedValue
        ? `Column "${form.expectedColumn || '?'}" should have value "${form.expectedValue}".`
        : 'Verify the column value matches expectations.';
    case 'Latest Record':
      return 'The most recent record should be returned.';
    case 'Duplicate Check':
      return `Duplicate values in "${form.duplicateColumn || 'column'}" should be listed.`;
    case 'NULL Validation':
      return 'Records with NULL values in the specified column should be returned.';
    case 'NOT NULL Validation':
      return 'Records with non-NULL values in the specified column should be returned.';
    case 'JOIN Validation':
      return 'Matching records from both tables should be returned.';
    case 'Aggregate Validation':
      return `Aggregated result (${form.aggregateFunction || 'COUNT'}) should be returned.`;
    case 'Date Validation':
      return 'Records within the specified date range should be returned.';
    case 'Custom SELECT Query':
      return 'Custom filtered results should be returned.';
    default:
      return 'Query results should be validated.';
  }
}

export function estimateComplexity(form) {
  let score = 1;
  if ((form.conditions || []).length > 2) score += 1;
  if ((form.conditions || []).length > 5) score += 1;
  if (form.joinEnabled) score += 1;
  if (form.aggregateEnabled) score += 1;
  if (form.validationType === 'Aggregate Validation') score += 1;
  if (form.validationType === 'JOIN Validation') score += 1;
  if (form.validationType === 'Date Validation') score += 1;
  if (form.orderByColumn) score += 0.5;
  if (form.limit) score += 0.5;
  if (score <= 2) return { level: 'Beginner', color: 'green', icon: '🟢' };
  if (score <= 4) return { level: 'Intermediate', color: 'yellow', icon: '🟡' };
  return { level: 'Advanced', color: 'red', icon: '🔴' };
}
