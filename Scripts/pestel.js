// Constantes pour la mise en page
const TITLE_Y_POSITION = 15;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 10;
const COLUMN_WIDTH = (PAGE_WIDTH - 2 * MARGIN) / 6;
const COLUMN_HEIGHT = PAGE_HEIGHT - 2 * MARGIN - TITLE_Y_POSITION;
const TITLE_OFFSET = 5;
const UNDERLINE_OFFSET = 1;
const interligne = 0.3;

// Couleurs pour chaque colonne PESTEL
const columnColors = [
  "#ff4c5c", "#ff949c", "#f0b484", 
  "#f8cc8c", "#ffec7c", "#d0dc74"
];

function makePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Titre
  doc.setFontSize(16);
  doc.text("Analyse PESTEL", PAGE_WIDTH / 2, TITLE_Y_POSITION, null, null, "center");

  // Récupérer les synthèses depuis localStorage
  const synthesesData = localStorage.getItem('syntheses');
  let syntheses = [];
  if (synthesesData) {
    syntheses = JSON.parse(synthesesData);
  } else {
    console.log('Aucune synthèse disponible.');
  }

  // Dessiner le schéma PESTEL
  drawPESTELDiagram(doc, syntheses);

  // Sauvegarder le PDF
  doc.save("synthese-pestel.pdf");
  stopLoad();
}

function drawPESTELDiagram(doc, syntheses) {
  const titles = ["Politique", "Économique", "Socioculturel", "Technologique", "Écologique", "Légal"];

  titles.forEach((title, index) => {
    const x = MARGIN + (COLUMN_WIDTH * index);
    const y = TITLE_Y_POSITION + 10;
    const text = syntheses[index] ? syntheses[index].synthesis : 'Pas de données';
    const color = columnColors[index];

    drawColumnWithText(doc, x, y, title, text, color);
  });
}

function drawColumnWithText(doc, x, y, title, text, color) {
  const [r, g, b] = hexToRgb(color);

  // Dessiner le rectangle de la colonne
  doc.setFillColor(r, g, b);
  doc.setDrawColor(0, 0, 0);
  doc.rect(x, y, COLUMN_WIDTH, COLUMN_HEIGHT, 'F');

  // Titre de la colonne
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(title, x + COLUMN_WIDTH / 2, y - TITLE_OFFSET, { align: "center" });

  // Soulignement du titre
  const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const underlineYPosition = y - UNDERLINE_OFFSET;
  doc.setDrawColor(0, 0, 0);
  doc.line(x + COLUMN_WIDTH / 2 - titleWidth / 2, underlineYPosition, 
           x + COLUMN_WIDTH / 2 + titleWidth / 2, underlineYPosition);

  // Texte de la colonne
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  drawMultilineText(doc, text, x + COLUMN_WIDTH / 2, y + 10, COLUMN_WIDTH - 4);
}

function drawMultilineText(doc, text, x, y, maxWidth) {
  const lines = splitTextIntoLines(doc, text, maxWidth);
  const lineHeight = doc.internal.getLineHeight() * interligne;

  lines.forEach((line, index) => {
    doc.text(line, x, y + index * lineHeight, { align: "center" });
  });
}

function splitTextIntoLines(doc, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = doc.getStringUnitWidth(currentLine + " " + word) * doc.internal.getFontSize() / doc.internal.scaleFactor;

    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}