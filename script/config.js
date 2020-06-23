const Defaults = new Map ([
    ["quickMode", false],
    ["nPawns", 5],
]);



function setDefaults() {
    for (const [key, value] of Defaults) {
        if (localStorage.getItem(key) == null) {
            localStorage.setItem(key, value);
        }
        Config[key] = localStorage.getItem(key);
    }
    return;
}

function resetDefaults() {
    localStorage.clear();
    setDefaults();
    return;
}

setDefaults();


Config.quickMode = true;


//resetDefaults();


