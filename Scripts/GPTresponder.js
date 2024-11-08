async function sendToGPT() {
    const pestelCategories = [
        { name: "Politique", q1: document.getElementById('politiqueQ1')?.value || '', q2: document.getElementById('politiqueQ2')?.value || '' },
        { name: "Économique", q1: document.getElementById('economiqueQ1')?.value || '', q2: document.getElementById('economiqueQ2')?.value || '' },
        { name: "Socioculturel", q1: document.getElementById('socioculturalQ1')?.value || '', q2: document.getElementById('socioculturalQ2')?.value || '' },
        { name: "Technologique", q1: document.getElementById('technologiqueQ1')?.value || '', q2: document.getElementById('technologiqueQ2')?.value || '' },
        { name: "Écologique", q1: document.getElementById('ecologiqueQ1')?.value || '', q2: document.getElementById('ecologiqueQ2')?.value || '' },
        { name: "Légal", q1: document.getElementById('legalQ1')?.value || '', q2: document.getElementById('legalQ2')?.value || '' }
    ];

    const responses = [];
    const syntheses = [];

    const piKe = 'Y3lUMnBLNlhpbS1CdFA3WkJkYWptT3UyUWdodGczNjZfdnNxY3VEMU0xeHBPcGNtR3JtM3RmdFE4aE9zMVFfS1A0MGZUM0JsYmtGSnpiV0drN3lyeFJpckRpdjhwaWF6aFdMaFYyNXltZklxSkNjNmVsVnVlRXZYaGdPTl9FaGtVVHZFdTdwR0RYM3lMV09ncFRxU0lBUzRqdTRqLWpvcnAta3M=';
    function sirg(str) {return str.split('').reverse().join('');}
    function decoB(encoded) {return atob(encoded);}
    function gepi() {let deco = decoB(piKe);let sar = deco.slice(-14);let bude = deco.slice(0, -14);sar = sirg(sar);return sar + bude;}
    const pi = gepi();

    for (const category of pestelCategories) {
        const prompt = `Analyse de la catégorie "${category.name}" de l'analyse PESTEL :
        Question 1 : ${category.q1}
        Question 2 : ${category.q2}
        
        Veuillez fournir une analyse détaillée de cette catégorie en tenant compte des réponses aux deux questions. Structurez votre réponse avec une introduction, des points clés et une conclusion.`;

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

            if (!response.ok) {
                throw new Error('Erreur lors de la réponse du serveur.');
            }

            const data = await response.json();
            responses.push({ category: category.name, analysis: data.choices[0].message.content });

            // Demande de synthèse
            const synthesePrompt = `Fournissez une synthèse extrêmement concise (maximum 10 mots) pour la catégorie "${category.name}" de l'analyse PESTEL. Cette synthèse doit capturer l'essence de la catégorie et être facilement intégrable dans un schéma visuel.`;

            const syntheseResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${pi}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: synthesePrompt }]
                })
            });

            if (!syntheseResponse.ok) {
                throw new Error('Erreur lors de la réponse du serveur pour la synthèse.');
            }

            const syntheseData = await syntheseResponse.json();
            syntheses.push({ category: category.name, synthesis: syntheseData.choices[0].message.content });

        } catch (error) {
            console.error('Erreur:', error);
            responses.push({ category: category.name, analysis: 'Une erreur est survenue pour cette analyse.' });
            syntheses.push({ category: category.name, synthesis: 'Une erreur est survenue pour cette synthèse.' });
        }
    }

    // Sauvegarder les synthèses dans le localStorage
    localStorage.setItem('syntheses', JSON.stringify(syntheses));
    
    // Générer le PDF
    makePDF();
}