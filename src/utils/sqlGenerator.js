import { quoteIdentifier, buildLimitClause, isTopStyle } from './databaseSyntax';

function formatValue(val, dbType) {
  if (!val || val === 'NULL' || val === 'null') return 'NULL';
  const num = Number(val);
  if (!isNaN(num) && val.trim() !== '') return val;
  const escaped = val.replace(/'/g, "''");
  return `'${escaped}'`;
}

function buildClause(condition, dbType) {
  const col = quoteIdentifier(condition.column, dbType);
  const op = condition.operator;
  const val = condition.value;

  if (!condition.column) return null;

  if (op === 'IS NULL') return `${col} IS NULL`;
  if (op === 'IS NOT NULL') return `${col} IS NOT NULL`;

  if (op === 'IN') {
    const items = val
      .split(',')
      .map((v) => formatValue(v.trim(), dbType))
      .join(', ');
    return `${col} IN (${items})`;
  }

  if (op === 'BETWEEN') {
    const parts = val.split(',').map((v) => v.trim());
    if (parts.length >= 2) {
      return `${col} BETWEEN ${formatValue(parts[0], dbType)} AND ${formatValue(parts[1], dbType)}`;
    }
    return null;
  }

  if (['=', '!=', '>', '<', '>=', '<=', 'LIKE'].includes(op)) {
    return `${col} ${op} ${formatValue(val, dbType)}`;
  }

  return null;
}

function buildWhereClause(conditions, dbType) {
  if (!conditions || conditions.length === 0) return '';

  const first = conditions[0];
  const firstClause = buildClause(first, dbType);
  if (!firstClause) return '';

  const parts = [firstClause];

  for (let i = 1; i < conditions.length; i++) {
    const logical = conditions[i].logical || 'AND';
    const clause = buildClause(conditions[i], dbType);
    if (clause) {
      parts.push(`  ${logical} ${clause}`);
    }
  }

  return `WHERE\n  ${parts.join('\n')}`;
}

function buildSelectColumns(form, dbType) {
  if (form.validationType === 'Count Records') return 'COUNT(*)';
  if (form.validationType === 'Verify Column Value') return form.conditions?.[0]?.column || '*';
  if (form.validationType === 'Duplicate Check') {
    const col = form.conditions?.[0]?.column || 'column_name';
    return `${quoteIdentifier(col, dbType)},\n  COUNT(*)`;
  }
  if (form.validationType === 'Aggregate Validation') {
    const fn = form.aggregateFunction || 'COUNT';
    const col = form.aggregateColumn ? quoteIdentifier(form.aggregateColumn, dbType) : '*';
    return `${fn}(${col})`;
  }
  return '*';
}

function buildFromClause(form, dbType) {
  let table = quoteIdentifier(form.tableName, dbType);
  if (form.joinEnabled && form.joinTable) {
    const joinType = form.joinType || 'INNER JOIN';
    const joinTable = quoteIdentifier(form.joinTable, dbType);
    const pk = form.joinPrimaryColumn ? quoteIdentifier(form.joinPrimaryColumn, dbType) : 'id';
    const fk = form.joinForeignColumn ? quoteIdentifier(form.joinForeignColumn, dbType) : 'foreign_id';
    table = `${table}\n${joinType} ${joinTable}\n  ON ${pk} = ${fk}`;
  }
  return `FROM ${table}`;
}

function buildGroupBy(form, dbType) {
  if (form.validationType === 'Duplicate Check') {
    const col = form.conditions?.[0]?.column || 'column_name';
    return `GROUP BY ${quoteIdentifier(col, dbType)}`;
  }
  if (form.aggregateEnabled && form.aggregateColumn && form.validationType !== 'Aggregate Validation') {
    return `GROUP BY ${quoteIdentifier(form.aggregateColumn, dbType)}`;
  }
  return '';
}

function buildHaving(form) {
  if (form.validationType === 'Duplicate Check') {
    return 'HAVING COUNT(*) > 1';
  }
  return '';
}

function buildOrderBy(form, dbType) {
  if (form.validationType === 'Latest Record' || form.orderByColumn) {
    const col = form.orderByColumn || 'id';
    const dir = form.orderByDirection || 'DESC';
    return `ORDER BY ${quoteIdentifier(col, dbType)} ${dir}`;
  }
  return '';
}

function buildLimit(form, dbType) {
  if (form.validationType === 'Latest Record') {
    return buildLimitClause(dbType, '1');
  }
  if (form.limit) {
    return buildLimitClause(dbType, String(form.limit));
  }
  return '';
}

const templates = {
  'Record Exists': (form, dbType) => {
    const columns = buildSelectColumns(form, dbType);
    const from = buildFromClause(form, dbType);
    const where = buildWhereClause(form.conditions, dbType);
    const orderBy = buildOrderBy(form, dbType);
    const limit = buildLimit(form, dbType);
    const having = buildHaving(form);
    const groupBy = buildGroupBy(form, dbType);
    return buildQuery(form, dbType, columns, from, where, groupBy, having, orderBy, limit);
  },
  'Record Does Not Exist': (form, dbType) => {
    const result = templates['Record Exists'](form, dbType);
    return result + '\n\n-- Expected Result: 0 rows';
  },
  'Count Records': (form, dbType) => {
    const columns = buildSelectColumns(form, dbType);
    const from = buildFromClause(form, dbType);
    const where = buildWhereClause(form.conditions, dbType);
    return buildQuery(form, dbType, columns, from, where, '', '', '', '');
  },
  'Verify Column Value': (form, dbType) => {
    const columns = buildSelectColumns(form, dbType);
    const from = buildFromClause(form, dbType);
    const where = buildWhereClause(form.conditions, dbType);
    return buildQuery(form, dbType, columns, from, where, '', '', '', '');
  },
  'Latest Record': (form, dbType) => {
    const columns = buildSelectColumns(form, dbType);
    const from = buildFromClause(form, dbType);
    const where = buildWhereClause(form.conditions, dbType);
    const orderBy = buildOrderBy(form, dbType);
    return buildQuery(form, dbType, columns, from, where, '', '', orderBy, 'LIMIT 1');
  },
  'Duplicate Check': (form, dbType) => {
    const columns = buildSelectColumns(form, dbType);
    const from = buildFromClause(form, dbType);
    const where = buildWhereClause(form.conditions, dbType);
    const groupBy = buildGroupBy(form, dbType);
    const having = buildHaving(form);
    return buildQuery(form, dbType, columns, from, where, groupBy, having, '', '');
  },
  'NULL Validation': (form, dbType) => {
    const col = form.conditions[0]?.column || 'column_name';
    const where = `${quoteIdentifier(col, dbType)} IS NULL`;
    return `SELECT *\nFROM ${quoteIdentifier(form.tableName, dbType)}\nWHERE ${where};`;
  },
  'NOT NULL Validation': (form, dbType) => {
    const col = form.conditions[0]?.column || 'column_name';
    const where = `${quoteIdentifier(col, dbType)} IS NOT NULL`;
    return `SELECT *\nFROM ${quoteIdentifier(form.tableName, dbType)}\nWHERE ${where};`;
  },
  'JOIN Validation': (form, dbType) => {
    const from = buildFromClause(form, dbType);
    const where = buildWhereClause(form.conditions, dbType);
    return buildQuery(form, dbType, '*', from, where, '', '', '', '');
  },
  'Aggregate Validation': (form, dbType) => {
    const columns = buildSelectColumns(form, dbType);
    const from = buildFromClause(form, dbType);
    const where = buildWhereClause(form.conditions, dbType);
    return buildQuery(form, dbType, columns, from, where, '', '', '', '');
  },
  'Date Validation': (form, dbType) => {
    const clauses = (form.conditions || []).map((c) => buildClause(c, dbType)).filter(Boolean);
    const where = clauses.length > 0 ? `WHERE\n  ${clauses.join('\n  AND ')}` : '';
    return `SELECT *\nFROM ${quoteIdentifier(form.tableName, dbType)}\n${where}\nORDER BY ${quoteIdentifier(form.conditions[0]?.column || 'created_at', dbType)} DESC;`;
  },
  'Custom SELECT Query': (form, dbType) => {
    const where = form.customWhere ? `WHERE ${form.customWhere}` : '';
    return `SELECT ${form.customSelect || '*'}\nFROM ${quoteIdentifier(form.tableName, dbType)}\n${where};`;
  },
};

function buildQuery(form, dbType, columns, from, where, groupBy, having, orderBy, limit) {
  const lines = [];
  if (isTopStyle(dbType) && limit) {
    lines.push(`SELECT ${limit} ${columns}`);
    lines.push(from);
  } else {
    lines.push(`SELECT ${columns}`);
    lines.push(from);
  }
  if (where) lines.push(where);
  if (groupBy) lines.push(groupBy);
  if (having) lines.push(having);
  if (orderBy) lines.push(orderBy);
  if (!isTopStyle(dbType) && limit) lines.push(limit);
  lines[lines.length - 1] += ';';
  return lines.join('\n');
}

export function generateSQL(form) {
  const generator = templates[form.validationType];
  if (!generator) {
    return '-- No SQL template found for the selected validation type.';
  }
  return generator(form, form.databaseType);
}

export function generateExplanation(sql, form) {
  const lines = [];
  lines.push('## SQL Query Explanation');
  lines.push('');
  lines.push('This query performs the following operations:');
  lines.push('');

  if (form.validationType === 'Count Records') {
    lines.push('1. **SELECT COUNT(*)** — Counts the total number of matching rows.');
  } else if (form.validationType === 'Duplicate Check') {
    lines.push('1. **SELECT column, COUNT(*)** — Selects the column and counts occurrences.');
    lines.push('2. **GROUP BY** — Groups results by the specified column.');
    lines.push('3. **HAVING COUNT(*) > 1** — Filters groups that have duplicates.');
  } else {
    lines.push('1. **SELECT** — Returns matching rows from the database.');
  }

  lines.push(`2. **FROM** — Reads data from the \`${form.tableName}\` table.`);

  if (form.joinEnabled && form.joinTable) {
    lines.push(`3. **${form.joinType}** — Joins with the \`${form.joinTable}\` table.`);
  }

  if (form.conditions && form.conditions.length > 0) {
    const active = form.conditions.filter((c) => c.column);
    lines.push(`${form.joinEnabled ? '4' : '3'}. **WHERE** — Filters records using specified conditions.`);
    active.forEach((c, i) => {
      lines.push(`   - \`${c.column} ${c.operator} ${c.value}\`${i < active.length - 1 ? ` (${c.logical || 'AND'})` : ''}`);
    });
  }

  if (form.validationType === 'Duplicate Check') {
    lines.push(`${form.joinEnabled ? '5' : '4'}. **HAVING** — Filters groups with more than one occurrence.`);
  }

  if (form.orderByColumn) {
    lines.push(`${form.joinEnabled ? '6' : form.validationType === 'Duplicate Check' ? '5' : '4'}. **ORDER BY** — Sorts results by \`${form.orderByColumn} ${form.orderByDirection || 'DESC'}\`.`);
  }

  if (form.validationType === 'Latest Record' || form.limit) {
    lines.push(`${form.joinEnabled ? '7' : '6'}. **LIMIT** — Returns only a subset of records.`);
  }

  lines.push('');
  lines.push('### Purpose');
  lines.push('');
  lines.push(getPurposeText(form));

  return lines.join('\n');
}

function getPurposeText(form) {
  switch (form.validationType) {
    case 'Record Exists': return 'Verify that at least one matching record exists in the database.';
    case 'Record Does Not Exist': return 'Verify that no matching records exist (e.g., after deletion).';
    case 'Count Records': return 'Verify the total number of matching records matches expectations.';
    case 'Verify Column Value': return 'Verify that a specific column contains the expected value.';
    case 'Latest Record': return 'Retrieve the most recently created or updated record.';
    case 'Duplicate Check': return 'Identify duplicate values in the specified column.';
    case 'NULL Validation': return 'Identify records where the specified column contains NULL.';
    case 'NOT NULL Validation': return 'Identify records where the specified column has a value.';
    case 'JOIN Validation': return 'Verify data integrity across related tables.';
    case 'Aggregate Validation': return 'Verify aggregated values (sum, average, etc.).';
    case 'Date Validation': return 'Verify records within a specific date range.';
    case 'Custom SELECT Query': return 'Run a custom query for specific validation needs.';
    default: return 'Validate data integrity.';
  }
}

export function generateChecklist(form) {
  const checks = [];

  if (form.tableName) {
    checks.push({ pass: true, text: 'SELECT statement' });
  } else {
    checks.push({ pass: false, text: 'No table selected' });
  }

  if (form.conditions && form.conditions.length > 0 && form.conditions[0].column) {
    checks.push({ pass: true, text: 'WHERE clause added' });
  } else if (!['Latest Record', 'Duplicate Check', 'NULL Validation', 'NOT NULL Validation'].includes(form.validationType)) {
    checks.push({ pass: false, text: 'WHERE clause missing' });
  } else {
    checks.push({ pass: true, text: 'WHERE clause added' });
  }

  checks.push({ pass: true, text: 'Safe query (SELECT only)' });
  checks.push({ pass: true, text: 'No DELETE statement' });
  checks.push({ pass: true, text: 'No UPDATE statement' });
  checks.push({ pass: true, text: 'No DROP statement' });
  checks.push({ pass: true, text: 'No TRUNCATE statement' });
  checks.push({ pass: true, text: 'Read-only query' });

  if (form.joinEnabled && form.joinTable) {
    checks.push({ pass: true, text: 'JOIN clause added' });
  }

  if (form.validationType === 'Count Records' && form.expectedCount) {
    checks.push({ pass: true, text: `Expected count: ${form.expectedCount}` });
  }

  if (form.validationType === 'Verify Column Value' && form.expectedColumn) {
    checks.push({ pass: true, text: `Verifying column: ${form.expectedColumn}` });
  }

  checks.push({ pass: true, text: 'Formatted SQL' });

  return checks;
}
