export function quoteIdentifier(name, dbType) {
  if (!name) return name;
  switch (dbType) {
    case 'PostgreSQL': return `"${name}"`;
    case 'MySQL': return `\`${name}\``;
    case 'SQL Server': return `[${name}]`;
    case 'Oracle': return `"${name}"`;
    case 'SQLite': return `"${name}"`;
    default: return name;
  }
}

export function buildLimitClause(dbType, count) {
  if (!count) return '';
  if (dbType === 'SQL Server') {
    return `TOP ${count}`;
  }
  if (dbType === 'Oracle') {
    return `FETCH FIRST ${count} ROWS ONLY`;
  }
  return `LIMIT ${count}`;
}

export function buildSelectPrefix(dbType, hasLimit) {
  if (dbType === 'SQL Server' && hasLimit) {
    return 'SELECT TOP';
  }
  return 'SELECT';
}

export function isTopStyle(dbType) {
  return dbType === 'SQL Server';
}
