function pawnStackStyle() {
    let style = document.createElement('style');
    style.type = 'text/css';
    let distance = 4;
    for (let i = 0; i < NPawns; i++) {
        style.innerHTML += `
        .tile-empty .pawn:nth-child(${i + 1}) {
            position: absolute;
            bottom: ${distance * i}px;
        }
        `;
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}

pawnStackStyle();