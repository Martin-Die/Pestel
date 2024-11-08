async function startLoad() {
    // Créer l'élément de chargement
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading';
    loadingElement.innerHTML = 'Chargement...';
    document.body.appendChild(loadingElement);

    // Styles pour l'élément de chargement
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '50%';
    loadingElement.style.left = '50%';
    loadingElement.style.transform = 'translate(-50%, -50%)';
    loadingElement.style.padding = '20px';
    loadingElement.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingElement.style.color = 'white';
    loadingElement.style.borderRadius = '10px';
    loadingElement.style.zIndex = '1000';

    // Animation de chargement
    let dots = 0;
    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingElement.innerHTML = 'Chargement' + '.'.repeat(dots);
    }, 500);

    // Écouter l'événement personnalisé pour cacher le chargement
    document.addEventListener('processingComplete', function() {
        loadingElement.style.display = 'none';
        clearInterval(interval);
        loadingElement.remove();
    }, { once: true });
}