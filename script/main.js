async function init() {
    if (Config.nPawns < 1) {
        resetDefaults();
    }

    drawBoard();
    stylePawnStack();
    drawPawns();
    drawDices();

    while (true) {
        let result = await turn().next()
        if (result.value == "end") {
            break
        }
    }
}

init();