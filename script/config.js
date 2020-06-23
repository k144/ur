const Defaults = new Map ([
    ["quickMode", false],
    ["nPawns", 7],
]);

// zmienić na klasę
let Config = {}


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

Config.set = function (key, value) {
    localStorage.setItem(key, value);
    Config[key] = value;
}

//resetDefaults();
//Config.set("quickMode", true);