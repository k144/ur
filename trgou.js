function huj () {
    let game = document.getElementById("game");
    let board = document.createElement("div");

    if (typeof huj.dupa == 'undefined') {
        huj.dupa = 1;
    }

    for (let i=0; i<huj.dupa; i++) {
        board.innerHTML += "huj";
    }
    huj.dupa++;

    game.appendChild(board);
    aaaaaaaaaaaaaaaaaaaaaaaaa
}