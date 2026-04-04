const XLSX = require('xlsx');
const workbook = XLSX.readFile('pokemon_clusters_2026-04-04.xlsx');
console.log('Sheets:', workbook.SheetNames);
workbook.SheetNames.forEach(name => {
  const sheet = workbook.Sheets[name];
  const data = XLSX.utils.sheet_to_json(sheet);
  console.log('\n=== Sheet:', name, '===');
  console.log(JSON.stringify(data, null, 2));
});
