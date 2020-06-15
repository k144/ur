async function init() {
    drawBoard();
    stylePawnStack();
    drawPawns();

    drawDices();

    while (true) {
        await turn(Side.LEFT);
        await turn(Side.RIGHT);
    }
}

init();