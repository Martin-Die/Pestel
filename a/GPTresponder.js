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

    for (const category of pestelCategories) {
        const prompt = `Analyse de la catégorie "${category.name}" de l'analyse PESTEL :
        Question 1 : ${category.q1}
        Question 2 : ${category.q2}
        
        Veuillez fournir une analyse détaillée de cette catégorie en tenant compte des réponses aux deux questions. Structurez votre réponse avec une introduction, des points clés et une conclusion.`;

        try {
            const response = await fetch('https://www.leblogdudirigeant.com/wp-json/custom-api/v1/chatgpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) throw new Error('Erreur lors de la réponse du serveur.');

            const data = await response.json();
            responses.push({ category: category.name, analysis: data.choices[0].message.content });

            // Synthèse
            const synthesePrompt = `Fournissez une synthèse extrêmement concise (maximum 10 mots) pour la catégorie "${category.name}" de l'analyse PESTEL.`;
            const syntheseResponse = await fetch('https://www.leblogdudirigeant.com/wp-json/custom-api/v1/chatgpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: synthesePrompt }]
                })
            });

            if (!syntheseResponse.ok) throw new Error('Erreur lors de la réponse du serveur pour la synthèse.');

            const syntheseData = await syntheseResponse.json();
            syntheses.push({ category: category.name, synthesis: syntheseData.choices[0].message.content });

        } catch (error) {
            console.error('Erreur:', error);
            responses.push({ category: category.name, analysis: 'Erreur lors de l\'analyse.' });
            syntheses.push({ category: category.name, synthesis: 'Erreur lors de la synthèse.' });
        }
    }

    localStorage.setItem('syntheses', JSON.stringify(syntheses));
    makePDF();
}
