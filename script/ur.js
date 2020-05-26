let board = document.getElementById("board");

for (let i = 0; i < 20; i++) {
    let t = document.createElement("div");
    t.className = "tile"
    board.append(t);
}