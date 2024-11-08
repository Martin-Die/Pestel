function stopLoad() {
    const event = new Event('processingComplete');
    document.dispatchEvent(event);
}