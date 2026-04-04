const XLSX = require('xlsx');

const completedPages = [
  "todos los pokemon",
  "cartas pokemon comprar",
  "jcc pokemon online",
  "pokemon deck",
  "pokemon evoluciones",
  "pokemon how to play",
  "precio de cartas pokemon",
  "álbum pokémon",
  "debilidades tipo agua",
  "descargar pokemon",
  "descargar pokémon rojo fuego en español",
  "fotos de pokémon",
  "pokemon 4 gen",
  "pokemon antiguos",
  "pokemon center peru",
  "pokemon comics",
  "pokemon de kanto",
  "pokemon esmeralda rom español",
  "pokemon go pokedex",
  "pokemon iniciales",
  "pokemon planta",
  "pokemon quinta generacion",
  "pokemon rubi omega",
  "pokemon tipo acero",
  "pokemon tipo fuego",
  "pokemon tipo normal",
  "pokemon tipo tierra",
  "pokemon verde",
  "pokemon zafiro",
  "pokemones de la tercera generación",
  "pokemones marrones",
  "regiones pokemon",
  "sobres de pokemon",
  "verde hoja"
];

const workbook = XLSX.readFile('pokemon_clusters_2026-04-04.xlsx');
const bdSheet = workbook.Sheets['BD'];
const data = XLSX.utils.sheet_to_json(bdSheet);

const uniquePages = [...new Set(data.map(row => row.Page))];
console.log('Unique pages in BD sheet:');
uniquePages.forEach(p => console.log(' -', p));

const headerRow = XLSX.utils.sheet_to_json(bdSheet, { header: 1 })[0];
if (!headerRow.includes('Avance')) {
  headerRow.push('Avance');
  data.forEach((row, idx) => {
    const page = row.Page?.toLowerCase().trim();
    const isCompleted = completedPages.some(cp => page === cp.toLowerCase().trim());
    row['Avance'] = isCompleted ? '✅ Completado' : '';
  });

  const newSheet = XLSX.utils.json_to_sheet(data, { header: headerRow });
  workbook.Sheets['BD'] = newSheet;
  XLSX.writeFile(workbook, 'pokemon_clusters_2026-04-04_updated.xlsx');
  console.log('\nFile updated successfully!');
  
  const completedCount = data.filter(r => r['Avance'] === '✅ Completado').length;
  console.log(`Marked ${completedCount} pages as completed`);
} else {
  console.log('Avance column already exists');
}