import * as readerScript from "./epub-reader.js";

var epubReader = null;
var preparedView = false;
const replace_dict = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "\r\n": "\n",
    // "\n": "<br />"
};

function prepareView() {
    if (!preparedView) {
        window.particleBackgroundInstance.stop();
        document.getElementById("particle").style.setProperty("height", "0", "important");
        preparedView = true;
    }
}

function handleFile(ev, filetype){
    prepareView();
    var bookData = ev.target.result;
    if (filetype.includes("epub")) {
        openBook(bookData);
    } else {
        createEpub(bookData);
    }
}

function submitText() {
    prepareView();
    var text_input = document.getElementById("text-input");
    let is_valid = text_input.reportValidity();
    if (!is_valid)  return;
    createEpub(text_input.value);
}

function openBook(bookData) {
    document.getElementById("viewer-wrapper").classList.remove("hidden");
    document.getElementById("epub_config").classList.remove('hidden');
    document.getElementById("setup").remove();

    epubReader = new readerScript.EpubReader(bookData);

    window.destroyParticleBackground();
    window.onbeforeunload = ev => false;
}

function changeFontSize(isIncrement) {
    epubReader.changeFontSize(isIncrement);
}

function highlightChapter() {
    epubReader.highlightChapter();
}

function toggleNav() {
    readerScript.toggleNav();
}

function foldAll() {
    readerScript.foldAll();
}

function prevPage() {
    epubReader.prevPage();
}

function nextPage() {
    epubReader.nextPage();
}

function createEpub(text) {

    function _addChapter(section, next_level, add_parent) {
        const __lastEntry = (list) => list[list.length-1];
        let proceed = section_stack.length >= 2 && (add_parent || next_level <= __lastEntry(number_stack));
        let spine = section_stack.pop(),
            spine_level = number_stack.pop();
        if (spine instanceof EpubMaker) {
            spine = spine.withSection(section);
        } else {
            spine = spine.withSubSection(section);
            if (proceed) {
                _addChapter(spine, next_level, next_level <= __lastEntry(number_stack));
            }
        }
        if (!proceed) {
            section_stack.push(spine);
            number_stack.push(spine_level);
        }
    };

    text = "\n" + text;
    for (var symbol in replace_dict) {
        text = text.replaceAll(symbol, replace_dict[symbol]);
    }

    let epubMaker = new EpubMaker()
                        .withTemplate('idpf-wasteland')
                        .withTitle('untitled');

    var match,
        matches = [];
    let heading_pattern = /\n#+ (.+)\n/g;

    while (match = heading_pattern.exec(text)) {
        delete match.input;
        matches.push(match);
    }

    var section_stack = [],
        number_stack = [];
    section_stack.push(epubMaker);
    number_stack.push(0);

    for (var idx = 0; idx < matches.length - 1; idx++) {
        let curr_match = matches[idx],
            next_match = matches[idx+1];
        
        let curr_level = curr_match[0].split('#').length - 1,
            next_level = next_match[0].split('#').length - 1;

        let start_index = curr_match.index + curr_match[0].length,
            ending_index = next_match.index;
        
        let content = text.slice(start_index, ending_index).replaceAll("\n", "<br />");
        let section = new EpubMaker.Section(null, `text-${idx}`, { title: curr_match[1], content: content }, true, false);

        if (next_level > curr_level) {
            section_stack.push(section);
            number_stack.push(curr_level);
        } else if (next_level === curr_level) {
            _addChapter(section, next_level, false);
        } else {
            _addChapter(section, next_level, true);
        }

        if (idx == matches.length - 2) {
            start_index = next_match.index + next_match[0].length;
            ending_index = text.length;

            content = text.slice(start_index, ending_index).replaceAll("\n", "<br />");
            section = new EpubMaker.Section(null, `text-${idx+1}`, { title: next_match[1], content: content }, true, false);

            _addChapter(section, 1, true);
        }
    }

    if (matches.length === 0) {
        text = text.replaceAll("\n", "<br />");
        epubMaker.withSection(new EpubMaker.Section(null, "untitled", { title: "untitled", content: text, renderTitle: false }, true, false));
    } else if (matches.length === 1) {
        let match = matches[0];
        let title = match[1],
            start_index = match.index + match[0].length,
            ending_index = text.length;
        let content = text.slice(start_index, ending_index).replaceAll("\n", "<br />");
        epubMaker.withSection(new EpubMaker.Section(null, title, { title: title, content: content, renderTitle: false }, true, false));
    } else {
        epubMaker = section_stack.pop();
    }

    // epubMaker.downloadEpub();
    epubMaker.makeEpub().then(function(epubZipContent) {
        if (window.FileReader) {
            var reader = new FileReader();
            reader.addEventListener("load", ev => { handleFile(ev, "epub"); });
            reader.readAsArrayBuffer(epubZipContent);
        }
    });
}

export {
    submitText, changeFontSize, toggleNav, highlightChapter, foldAll, handleFile, 
    prevPage, nextPage
};