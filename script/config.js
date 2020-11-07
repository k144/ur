let version = {
    number: "0.8.15",
    name: "Bogowie i Królowie (pre)",
    date: "2020.11.08"
}


let Config = {
    autoRoll: {
        default: false,
        changableInGame: true,
        control: {
            type: "bool",
            label: "Automatyczny rzut kośćmi",
            callbackOn: () => {
                DicesDiv.click();
            }
        },
    },
    nPawns: {
        default: 5,
        changableInGame: false,
        control: {
            type: "slider",
            min: 1,
            max: 7,
            label: "Liczba pionków",
            callback: () => {
                if (GameHasStarted) { return };
                locateTile(0, Side.LEFT).innerHTML = '';
                locateTile(0, Side.RIGHT).innerHTML = '';
                drawPawns();
                stylePawnStack();
            }
        },
    },
};


function setConfigVal() {
    for (const opt in Config) {
        if (!Config[opt].changableInGame && GameHasStarted) {
            document.getElementById("refresh-prompt").style.display = "block";
            return;
        }
        if (localStorage.getItem(opt) == null) {
            Config[opt].val = Config[opt].default;
            continue;
        }
        if (typeof (Config[opt].default) == "boolean") {
            Config[opt].val = localStorage.getItem(opt) == "true";
            continue;
        }
        Config[opt].val = localStorage.getItem(opt);
    }
    return;
}

function resetDefaults() {
    localStorage.clear();
    setConfigVal();
    updateSettings();
    return;
}

setConfigVal();

function setConfig (key, value) {
    localStorage.setItem(key, value);
    if (!Config[key].changableInGame && GameHasStarted) {
        document.getElementById("refresh-prompt").style.display = "block";
        return;
    }
    if (typeof (value) == "boolean") {
        Config[key].val = value;
        return;
    }
    Config[key].val = value;
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

// showLogOnPage();
