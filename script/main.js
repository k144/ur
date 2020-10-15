async function init() {
    setConfigVal();
    if (Config.nPawns.val < 1) {
        resetDefaults();
    }
    drawVersion();

    preloadImgs();

    drawBoard();
    stylePawnStack();
    drawPawns();
    drawDices();
    populateSettings();

    while (true) {
        let result = await turn().next();
        if (result.value == "end") {
            break;
        }
    }
}

init();