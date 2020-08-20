async function init() {
    setDefaults();
    if (Config.nPawns < 1) {
        resetDefaults();
    }
    drawVersion();

    drawButtons();

    preloadImgs();

    drawBoard();
    stylePawnStack();
    drawPawns();
    drawDices();

    while (true) {
        let result = await turn().next();
        if (result.value == "end") {
            break;
        }
    }
}

init();