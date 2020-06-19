async function init() {
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