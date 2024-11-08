function Test2() {
    console.log("Début du traitement...");

    setTimeout(() => {
        console.log("5");
        console.log('test2 finis');

        stopLoad();
    }, 5000);
}