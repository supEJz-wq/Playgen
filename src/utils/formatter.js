export function formatCode(code, settings) {
  let result = code;
  const indent = settings.indentation === '4 Spaces' ? '    ' : '  ';
  const useSemicolons = settings.semicolons === 'On';

  result = result.replace(/^( {2}|\t)/gm, (match) => indent);

  if (!useSemicolons) {
    result = result.replace(/;/g, '');
  }

  if (settings.quoteStyle === 'Double Quotes') {
    result = convertQuotes(result);
  }

  return result;
}

function convertQuotes(code) {
  const lines = code.split('\n');
  return lines.map((line) => {
    if (line.includes("'")) {
      let result = '';
      let inString = false;
      let stringChar = null;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === "'" || ch === '"') {
          if (!inString) {
            inString = true;
            stringChar = ch;
            result += ch === "'" ? '"' : "'";
          } else if (ch === stringChar) {
            inString = false;
            result += ch === "'" ? '"' : "'";
          } else {
            result += ch;
          }
        } else {
          result += ch;
        }
      }
      return result;
    }
    return line;
  }).join('\n');
}
