function Test() {
    console.log("Début du traitement...");

    setTimeout(() => {
        console.log("5");
        console.log('test1 finis');
        Test2();
    }, 5000);
}