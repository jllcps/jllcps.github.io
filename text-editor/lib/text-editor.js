var ext_li = ["video", "audio", "image"];


function init() {
    document.getElementsByClassName('CodeMirror')[0].style.display = "none";

    document.getElementById("plus_btn").onclick = e => {
        font_size += 1; 
        document.querySelector(".CodeMirror").style.setProperty("font-size", `${font_size}px`);
    };

    document.getElementById("minus_btn").onclick = e => {
        font_size -= 1; 
        document.querySelector(".CodeMirror").style.setProperty("font-size", `${font_size}px`);
    };

    const icons = document.querySelectorAll('.icon');
    icons.forEach(elem => elem.addEventListener('click', ev => {
        modeInput.value = ev.currentTarget.getAttribute("data-val");
        if (modeInput.value == ev.currentTarget.getAttribute("data-val")) {
            change(null);
        }
    }));
}


function load_file(input) {
    var reader = new FileReader();
    let file = input.files[0];
    modeInput.value = file.name;
    reader.onload = e => change(reader.result);
    if (ext_li.some(ext => file.type.includes(ext))) {
        alert(`The file type ${file.type} is not allowed.`);
    } else {
        reader.readAsText(file);
    }
}


function change(text) {
    let is_valid = modeInput.reportValidity();
    if (!is_valid)  return;
    var val = modeInput.value, m, mode, spec;
    if (m = /.+\.([^.]+)$/.exec(val)) {
        let info = CodeMirror.findModeByExtension(m[1]);
        if (info) {
            mode = info.mode;
            spec = info.mime;
        }
    } else if (/\//.test(val)) {
        let info = CodeMirror.findModeByMIME(val);
        if (info) {
            mode = info.mode;
            spec = val;
        }
    } else {
        mode = spec = val;
    }
    if (mode) {
        window.particleBackgroundInstance.stop();
        document.getElementById("particle").style.setProperty("height", "0", "important");
        document.getElementById("config").style.removeProperty('display');
        document.getElementsByClassName('CodeMirror')[0].style.removeProperty('display');

        if (text) {
            editor.setValue(text);
        } else {
            window.onclick = e => {
                document.getElementsByTagName('textarea')[0].focus();
            };
        }
        filename = modeInput.value;
        document.title = filename;
        editor.setOption("mode", spec);
        CodeMirror.autoLoadMode(editor, mode);

        window.destroyParticleBackground();
        document.getElementById("setup").remove();
        window.onbeforeunload = e => false;
    } else {
        alert("Could not find the language for " + val);
    }
}


function saveFile() {
    if (confirm(`Save as "${filename}"?`)) {
        var blob = new Blob([editor.getValue()],
            { type: "text/plain;charset=utf-8" });
        saveAs(blob, filename);    
    }
}


function rmTrailingSpace() {
    if (confirm("Remove trailing spaces?")) {
        var ar = editor.getValue().split(/\r\n|\r|\n/);
        for (var i in ar) {
            ar[i] = ar[i].replace(/\s+$/, '');
            // if (/^\s*$/.test(ar[i]) == true)
            //     ar[i] = "";
        }
        editor.setValue(ar.join("\n"));
    }
}


var filename, font_size = 19;
var modeInput = document.getElementById("mode");
var editor = CodeMirror(document.body, {
    theme: "neo",
    keyMap: "sublime",
    indentUnit: 4,
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    // highlightNonMatching: false,
    // spellcheck: false,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    extraKeys: {
        "Tab": cm => cm.execCommand("indentMore"),
        "Ctrl-Q": cm => cm.foldCode(cm.getCursor()),
        "Ctrl-[": cm => cm.execCommand('foldAll'),
        "Ctrl-]": cm => cm.execCommand('unfoldAll'),
        "Cmd-S": cm => false,
    },
});

CodeMirror.modeURL = "mode/%N/%N.js";
CodeMirror.on(modeInput, "keypress", function(e) {
    if (e.keyCode == 13) change(null);
});

init();
