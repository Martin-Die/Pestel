function makePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Stylisation du PDF - Titre
    doc.setFontSize(16);
    doc.text("Schéma des 5 Forces de Porter", 105, 20, null, null, "center");

    // Récupérer les synthèses depuis localStorage
    const synthesesData = localStorage.getItem('syntheses');
    let syntheses = [];

    if (synthesesData) {
        syntheses = JSON.parse(synthesesData);
    } else {
        console.log('Aucune synthèse disponible.');
    }

    // Dessiner le schéma des 5 forces de Porter
    drawPorterDiagram(doc, syntheses);

    // Sauvegarder le PDF
    doc.save("syntheses-forces-porter.pdf");
    stopLoad();
}

const interligne = 0.3;

function drawPorterDiagram(doc, syntheses) {
    const centerX = 105;  // Position X du centre
    const centerY = 130;  // Position Y du centre
    const radius = 30;    // Rayon du cercle central

    // Dessiner le cercle central
    doc.setDrawColor(0, 0, 255);
    doc.setFillColor(173, 216, 230);  // Bleu clair
    doc.circle(centerX, centerY, radius, 'F');  // Cercle rempli et bordé

    // Ajouter le texte à l'intérieur du cercle
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const centralText = syntheses[0] ? syntheses[0].synthesis : 'Pas de données';
    const centralLines = splitTextIntoLines(doc, centralText, radius * 2); // interligne du rond
    const lineHeight = doc.internal.getLineHeight() * interligne;
    
    centralLines.forEach((line, index) => {
        const yOffset = (index - (centralLines.length - 1) / 2) * lineHeight;
        doc.text(line, centerX, centerY + yOffset, { align: "center" });
    });

    const topText = syntheses[1] ? syntheses[1].synthesis : 'Pas de données';
    const bottomText = syntheses[2] ? syntheses[2].synthesis : 'Pas de données';
    const leftText = syntheses[3] ? syntheses[3].synthesis : 'Pas de données';
    const rightText = syntheses[4] ? syntheses[4].synthesis : 'Pas de données';


    // Dessiner les flèches et le texte associé
    drawArrowWithText(doc, centerX, centerY - radius - 72, topText, "up");
    drawArrowWithText(doc, centerX, centerY + radius + 72, bottomText, "down");
    drawArrowWithText(doc, centerX - radius - 72, centerY, leftText, "left");
    drawArrowWithText(doc, centerX + radius + 72, centerY, rightText, "right");
}

function drawArrowWithText(doc, x, y, text, direction) {
    const arrowLength = 40;  // Longueur du corps de la flèche
    const arrowWidth = 40;   // Largeur du corps de la flèche
    const arrowTipWidth = 50; // Largeur des pointes
    const arrowTipLength = 30; // Longueur des pointes

    doc.setFillColor(0, 0, 255);  // Bleu foncé pour les flèches
    doc.setDrawColor(0, 0, 0);

    // Dessiner les flèches selon la direction
    switch (direction) {
        case "up":
            // Corps de la flèche vers le bas
            doc.rect(x - arrowWidth / 2, y, arrowWidth, arrowLength, 'F');
            doc.triangle(
                x, y + arrowLength + arrowTipLength,  // Sommet de la pointe
                x - arrowTipWidth / 2, y + arrowLength,  // Coin gauche
                x + arrowTipWidth / 2, y + arrowLength,  // Coin droit
                'F'
            );
            drawMultilineText(doc, text, x, y + arrowLength / 2 + 3, arrowWidth);
            break;

        case "down":
            // Corps de la flèche vers le haut
            doc.rect(x - arrowWidth / 2, y - arrowLength, arrowWidth, arrowLength, 'F');
            doc.triangle(
                x, y - arrowLength - arrowTipLength,  // Sommet de la pointe
                x - arrowTipWidth / 2, y - arrowLength,  // Coin gauche
                x + arrowTipWidth / 2, y - arrowLength,  // Coin droit
                'F'
            );
            drawMultilineText(doc, text, x, y - arrowLength / 2 - 5, arrowWidth);
            break;

        case "left":
            // Corps de la flèche vers la droite
            doc.rect(x, y - arrowWidth / 2, arrowLength, arrowWidth, 'F');
            doc.triangle(
                x + arrowLength + arrowTipLength, y,  // Sommet de la pointe, collé au corps
                x + arrowLength, y - arrowTipWidth / 2,  // Coin haut
                x + arrowLength, y + arrowTipWidth / 2,  // Coin bas
                'F'
            );
            drawMultilineText(doc, text, x + arrowLength / 2 + 5, y, arrowLength);
            break;

        case "right":
            // Corps de la flèche vers la gauche
            doc.rect(x - arrowLength, y - arrowWidth / 2, arrowLength, arrowWidth, 'F');
            doc.triangle(
                x - arrowLength - arrowTipLength, y,  // Sommet de la pointe, collé au corps
                x - arrowLength, y - arrowTipWidth / 2,  // Coin haut
                x - arrowLength, y + arrowTipWidth / 2,  // Coin bas
                'F'
            );
            drawMultilineText(doc, text, x - arrowLength / 2 - 5, y, arrowLength);
            break;
    }
}

function drawMultilineText(doc, text, x, y, maxWidth) {
    const lines = splitTextIntoLines(doc, text, maxWidth);
    const lineHeight = doc.internal.getLineHeight() * interligne; // interligne des flèches
    const verticalOffset = 2;
    lines.forEach((line, index) => {
        doc.text(line, x, y + index * lineHeight - verticalOffset, { align: "center" });
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