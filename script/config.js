// zmienić na klasę
let Config = {
    version: {
        number: "0.8.5",
        name: "Bogowie i Królowie (pre)",
        date: "2020.08.22"
    }
};

const Defaults = new Map([
    ["autoRoll", false],
    ["nPawns", 7],
]);


function setDefaults() {
    for (const [key, value] of Defaults) {
        if (localStorage.getItem(key) == null) {
            localStorage.setItem(key, value);
        }
        if (typeof (value) == "boolean") {
            Config[key] = localStorage.getItem(key) == "true";
            continue;
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

function showLogOnPage() {
    let oldLog = console.log;
    console.log = function (...args) {
        oldLog.apply(this, args);
        let output = document.getElementById("console");
        output.style.display = "block";
        for (let arg of args) {
            arg = (typeof arg === "object" ? JSON.stringify(arg, null, 4) : arg);
        }
        output.innerHTML += args.join(" ") + "<br/>";
    }
}

showLogOnPage();
