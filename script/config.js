let version = {
    number: "0.8.10",
    name: "Bogowie i Królowie (pre)",
    date: "2020.10.13"
}


let Config = {
    autoRoll: {
        default: false,
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
        control: {
            type: "slider",
            min: 1,
            max: 7,
            label: "Liczba pionków",
        },
    },
};


function setConfigVal() {
    for (const opt in Config) {
        if (localStorage.getItem(opt) == null) {
            localStorage.setItem(opt, Config[opt].default);
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
    return;
}

setConfigVal();

function setConfig (key, value) {
    localStorage.setItem(key, value);
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
