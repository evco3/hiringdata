import fs from 'fs';
import path from 'path';

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function formatPlayerName(name: string): string {
  let cleaned = name.replace(/"/g, '');
    if (cleaned.includes(',')) {
    const parts = cleaned.split(',').map(part => part.trim());
    if (parts.length === 2) {
      return `${parts[1]} ${parts[0]}`;
    }
  }
  return cleaned;
}

export async function fetchCSVData(filePath: string) {
  const fullPath = path.join(process.cwd(), 'public', filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  
  const lines = fileContent.trim().split('\n');
  const columns = parseCSVLine(lines[0]);
  
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: any = {};
    columns.forEach((column, index) => {
      let value: string | number = values[index] || '';
      if (column === 'player_name') {
        value = formatPlayerName(value);
      }if (column === 'toi') {
        value = value.replace(/(\d)\.(?=[^:]*$)/, '0$1');
        value = value.trim();
      }if (['season', 'gp', 'shots', 'goals', 'assists', 'points'].includes(column)) {
        value = parseInt(value.trim());
      }
      row[column] = value;
    });
    return row;
  });
  
  return { columns, rows };
}
