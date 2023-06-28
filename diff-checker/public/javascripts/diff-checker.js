const ext_li = ["video", "audio", "image"];


function input_text(input) {
    let div_col = input.closest("div.col");
    let textarea = div_col.querySelector("textarea");
    div_col.querySelector("div.label-container").remove();
    textarea.removeAttribute("hidden");
    textarea.setAttribute('data-fname', textarea.id);
    window.onbeforeunload = e => false;
}


function load_file(input) {
    var reader = new FileReader();
    let file = input.files[0];

    reader.onloadend = (e) => {
        let div_col = input.closest("div.col");
        let textarea = div_col.querySelector("textarea");
        textarea.value = reader.result;
        div_col.querySelector("div.label-container").remove();
        textarea.removeAttribute("hidden");
        textarea.setAttribute('data-fname', file.name);
        window.onbeforeunload = e => false;
    };

    if (ext_li.some(ext => file.type.includes(ext))) {
        alert(`The file type ${file.type} is not allowed.`);
    } else {
        reader.readAsText(file);
    }
}


function compare() {
    let inputs = document.querySelectorAll('textarea');
    for (const input of inputs) {
        let is_valid = input.reportValidity();
        if (!is_valid)  return;
    }

    var text_1 = document.getElementById('text-1');
    var text_2 = document.getElementById('text-2');

    let diff = Diff.structuredPatch('', '', text_1.value, text_2.value, 
                            text_1.getAttribute("data-fname"), text_2.getAttribute("data-fname"), {"context": 3});

    formatPatch(diff);

    document.querySelectorAll(".pre-diff").forEach(elem => elem.remove());
    document.querySelectorAll(".post-diff").forEach(elem => elem.removeAttribute("hidden"));
}


function formatPatch(diff) {
    var bold_li = [];
    var fragment = document.createDocumentFragment();
    var result = document.getElementById('result');

    function add_line_break(fragment) {    
        br = document.createElement('br');
        fragment.appendChild(br);
    }

    if (diff.oldFileName == diff.newFileName) {
        bold_li.push('Index: ' + diff.oldFileName);
    }

    bold_li.push('==============================');
    bold_li.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
    bold_li.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));

    bold_li.forEach(function(text){
        span = document.createElement('span');
        span.style.fontWeight = "300";
        span.appendChild(document.createTextNode(text));
        fragment.appendChild(span);
        add_line_break(fragment);
    });

    diff.hunks.forEach(function(hunk){
        if (hunk.oldLines === 0) {
            hunk.oldStart -= 1;
        }

        if (hunk.newLines === 0) {
            hunk.newStart -= 1;
        }

        let range = '@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@';

        add_line_break(fragment);
        span = document.createElement('span');
        // span.style.color = "black";
        span.appendChild(document.createTextNode(range));
        fragment.appendChild(span);
        add_line_break(fragment);

        hunk.lines.forEach(function(line){
            span = document.createElement('span');
            span.style.color = 'dimgray';
            if (line[0] === "+") {
                span.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
            } else if (line[0] === "-") {
                span.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
            } else {
                span.style.color = 'darkgray';
            }
            span.appendChild(document.createTextNode(line));
            fragment.appendChild(span);
            add_line_break(fragment);
        });
    });

    result.innerHTML = '';
    result.appendChild(fragment);
}


function addListeners() {
    document.querySelectorAll(".dropContainer").forEach((elem, idx) => {
        elem.ondragover = elem.ondragenter = function(evt) {
            evt.preventDefault();
        };

        elem.ondrop = function(evt) {
            var fileInput = elem.querySelector("input[type='file']");
            fileInput.files = evt.dataTransfer.files;
            fileInput.onchange();
            evt.preventDefault();
        };
    });
}

addListeners();