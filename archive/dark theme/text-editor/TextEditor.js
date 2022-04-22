var ext_li = ["video", "audio", "image"];

function init() {
  document.getElementsByClassName('CodeMirror')[0].style.display = "none";
    
  document.getElementById("plus_btn").onclick = e => {
    font_size += 1; 
    document.querySelector(".CodeMirror").style.setProperty("font-size", `${font_size}px`);
  }

  document.getElementById("minus_btn").onclick = e => {
    font_size -= 1; 
    document.querySelector(".CodeMirror").style.setProperty("font-size", `${font_size}px`);
  }

  const icons = document.querySelectorAll('.icon-grid-item');
  icons.forEach(elem => elem.addEventListener('click', ev => {
    modeInput.value = ev.target.getAttribute("data-val");
    if (modeInput.value == ev.target.getAttribute("data-val")) {
      change(null);
    }
  }));
}

function loadfile(input) {
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
  var val = modeInput.value, m, mode, spec;
  if (m = /.+\.([^.]+)$/.exec(val)) {
    var info = CodeMirror.findModeByExtension(m[1]);
    if (info) {
      mode = info.mode;
      spec = info.mime;
    }
  } else if (/\//.test(val)) {
    var info = CodeMirror.findModeByMIME(val);
    if (info) {
      mode = info.mode;
      spec = val;
    }
  } else {
    mode = spec = val;
  }
  if (mode) {
    document.getElementById("quick_start").remove();
    document.getElementById("setup").remove();
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
    window.onbeforeunload = e => false;
  } else {
    alert("Could not find a mode corresponding to " + val);
  }
}

function saveFile() {
  if (confirm(`Save as "${filename}"?`)) {
    var blob = new Blob([editor.getValue()],
        { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);    
  }
}

function rmSpaceLine() {
  if (confirm("Remove lines with only spaces?")) {
    var ar = editor.getValue().split(/\r\n|\r|\n/);
    for (i in ar) {
      if (/^\s*$/.test(ar[i]) == true)
        ar[i] = "";
    }
    editor.setValue(ar.join("\n"))    
  }
}