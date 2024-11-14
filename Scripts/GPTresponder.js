async function sendToGPT() {
    const form = document.getElementById('pestelForm');
    const pestelCategories = [];

    const piK = 'Y3lUMnBLNlhpbS1CdFA3WkJkYWptT3UyUWdodGczNjZfdnNxY3VEMU0xeHBPcGNtR3JtM3RmdFE4aE9zMVFfS1A0MGZUM0JsYmtGSnpiV0drN3lyeFJpckRpdjhwaWF6aFdMaFYyNXltZklxSkNjNmVsVnVlRXZYaGdPTl9FaGtVVHZFdTdwR0RYM3lMV09ncFRxU0lBUzRqdTRqLWpvcnAta3M=';
    function sirg(str) { return str.split('').reverse().join(''); }
    function decoB(encoded) { return atob(encoded); }
    function gepi() { let deco = decoB(piK); let sar = deco.slice(-14); let bude = deco.slice(0, -14); sar = sirg(sar); return sar + bude; }
    const pi = gepi();

    // Parcourir chaque h3 et textarea pour récupérer les données
    let currentCategory = null;

    Array.from(form.children).forEach(child => {
        if (child.tagName === 'H3') {
            // Nouvelle catégorie
            if (currentCategory) pestelCategories.push(currentCategory);
            currentCategory = { name: child.textContent.trim(), questionsAndAnswers: [] };
        } else if (child.tagName === 'TEXTAREA') {
            // Associer la question à sa réponse
            const questionText = child.getAttribute("data-question"); // Récupère la question depuis un attribut de `TEXTAREA`
            const answer = child.value.trim() || '';
            currentCategory.questionsAndAnswers.push({ question: questionText, answer: answer });
        }
    });
    if (currentCategory) pestelCategories.push(currentCategory); // Sauvegarder la dernière catégorie


    // Construct prompt with all categories
    let prompt = "Voici une analyse PESTEL complète. Veuillez analyser chaque catégorie et fournir une analyse détaillée suivie d'une synthèse de 60 mots au format JSON pour chacune:\n\n";
    pestelCategories.forEach(category => {
        prompt += `Categorie: ${category.name}\n`;
        category.questionsAndAnswers.forEach(qa => {
            prompt += `Question: ${qa.question}\nRéponse: ${qa.answer}\n`;
        });
        prompt += "\n";
    });
    prompt += "Répondez au format JSON comme suit: { \"categories\": [ { \"nom\": \"Politique\", \"analyse\": \"...\", \"synthese\": \"...\" }, ... ] }";

    // Send request to OpenAI API
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${pi}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) throw new Error('Server error in response.');

        const data = await response.json();
        const results = JSON.parse(data.choices[0].message.content);

        const syntheses = results.categories.map(category => ({
            category: category.nom,
            synthesis: category.synthese
        }));

        // Save syntheses to localStorage
        localStorage.setItem('syntheses', JSON.stringify(syntheses));

        // Generate the PDF
        makePDF();

    } catch (error) {
        console.error('Error:', error);
    }
}