var preparedView = false;

var replace_dict = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "\r\n": "\n",
    // "\n": "<br />"
};


function highlight_chapter() {

    function _addChapterCfi(href) {
        let section = document.getElementById(href);
        if (section.getAttribute("data-checked")) {
            return;
        }

        const spineId = book.spine.spineByHref[href];
        const spineItem = book.spine.spineItems[spineId];

        const links = document.querySelectorAll(`#tocs div.links.collapsible[data-href^='${href}']`);
        links.forEach((link) => {
            const hrefComponents = link.getAttribute("data-href").split("#");
            if (hrefComponents.length === 1) {
                link.setAttribute("data-checked", true);
            } else if (hrefComponents.length !== 2) {
                return;
            }

            const elem = spineItem.document.getElementById(hrefComponents[1]);
            const cfi = spineItem.cfiFromElement(elem);
            link.setAttribute('data-cfi', cfi);
        });
    }

    function _findVisibleAnchor(href) {
        // const iframeWindow = document.querySelector('#viewer iframe[id^="epubjs-view"]').contentWindow;
        // const anchors = iframeWindow.document.body.querySelectorAll(`[id]`);
        const anchors = rendition.getContents()[0].content.querySelectorAll(`[id]`);
        if (anchors.length === 0)
            return href;

        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0,
              viewportTop = document.body.scrollTop || window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0,
              viewportBottom = viewportTop + viewportHeight;

        let lastAnchor = anchors[0];
        for (const anchor of anchors) {
            const top = anchor.offsetTop;
            if (top < viewportTop) {
                lastAnchor = anchor;
                // if (document.getElementById(`${href}#${anchor.id}`))
                //     lastAnchor = anchor;
            } else if (top < viewportBottom) {
                return `${href}#${anchor.id}`;
                // if (document.getElementById(`${href}#${anchor.id}`))
                //     return `${href}#${anchor.id}`;
            } else {
                break;
            }
        }
        return `${href}#${lastAnchor.id}`;
    }

    function _activateLink(link) {
        if (link == null)
            return false;
        link.classList.add("active");
        const content = link.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + "px";
        let elem = link.parentElement;
        while (elem) {
            if ((elem.tagName === "DIV") && elem.classList.contains("content")) {
                let prevSibling = elem.previousElementSibling;
                prevSibling.classList.add("active");
                elem.style.maxHeight = elem.scrollHeight + "px";
            }
            elem = elem.parentElement;
            if (elem.id === "tocs")  break;
        }
        link.scrollIntoView({block: "center", inline: "nearest"});
        return true;
    }

    const href = rendition.location.end.href;
    const hrefWithAnchor = _findVisibleAnchor(href);
    // _addChapterCfi(href);

    const elem = document.getElementById(hrefWithAnchor) || document.getElementById(href)
    var activated = _activateLink(elem);
    let firstLink = null;
    if (!activated) {
        let links = document.querySelectorAll("#tocs div.links.collapsible");
        for (const link of links) {
            const linkHref = link.getAttribute("data-href");
            if (linkHref.startsWith(href)) {
                if (!linkHref)  firstLink = link;
                if (linkHref.startsWith(hrefWithAnchor)) {
                    _activateLink(link)
                    break;
                }
            } else if (firstLink !== null) {
                _activateLink(firstLink);
                break;
            }
        };
    }
}


function toggle_nav() {
    let mySidenav = document.getElementById("mySidenav");
    if (mySidenav.style.display === "none") {
        mySidenav.style.display = "block";
    } else {
        mySidenav.style.display = "none";
    }
}


function fold_all() {
    let elems = document.querySelectorAll("#epub_config .active");
    elems.forEach((elem) => {
        elem.classList.remove("active");
        if (elem.id == "toolbar") {
            toggle_nav();
        } else if (elem.classList.contains("expandable")) {
            elem.nextElementSibling.style.maxHeight = null;
        }
    });
}


function toc(book){

    function _add_toc(chapter) {
        var item = document.createElement("li");
        var link = document.createElement("div");
        link.classList.add("links");
        link.classList.add("collapsible");
        link.textContent = chapter.label;
        link.setAttribute("data-href", chapter.href);
        link.addEventListener("click", function(event) {
            event.preventDefault();
            if (link.classList.contains("expandable")) {
                link.classList.toggle("active");
                var content = link.nextElementSibling;
                if (content.style.maxHeight){
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    let elem = link.parentElement;
                    while (elem) {
                        if (elem.classList.contains("content")) {
                            elem.style.maxHeight = elem.scrollHeight + "px";
                        }
                        elem = elem.parentElement;
                    }
                } 
            } else {
                fold_all();
                var url = link.getAttribute("data-href");
                rendition.display(url).then(() => {
                    let hrefComponents = url.split("#");
                    if (hrefComponents.length > 1) {
                        let iframeWindow = rendition.getContents()[0].window;
                        // let iframeWindow = document.querySelector('#viewer iframe[id^="epubjs-view"]').contentWindow;
                        if (hrefComponents[0] === rendition.location.end.href) {
                            iframeWindow.location.hash = hrefComponents[1];
                        } else {
                            setTimeout(() => {
                                iframeWindow.location.hash = hrefComponents[1];
                                // iframeWindow.document.getElementById(hrefComponents[1]).scrollIntoView();
                            }, 300);
                        }
                    }
                });
                return false;
            }
        });

        link.id = chapter.href;
        // if (book.spine.spineByHref[chapter.href] !== undefined) {
        //     link.id = chapter.href;
        // }

        if (chapter.subitems.length !== 0) {
            link.classList.toggle("expandable");
        }

        item.appendChild(link);

        var $div = document.createElement("div");
        $div.classList.add("content");

        var ul_sub = document.createElement("ul");
        chapter.subitems.forEach(function(chapter_sub) {
            item_sub = _add_toc(chapter_sub);
            ul_sub.appendChild(item_sub);
        });

        $div.appendChild(ul_sub);
        item.appendChild($div);

        return item;
    }

    book.loaded.navigation.then(function(toc){
        var $ul = document.getElementById("tocs");
        toc.forEach(function(chapter) {
            var item = _add_toc(chapter);
            $ul.appendChild(item);
        });
    });
}


function addons(rendition){

    function _prevPage(ev) {
        ev.preventDefault();
        if (mySidenav.style.display == "none") {
            rendition.prev();
            document.body.scrollTop = 0;
        }
    };

    function _nextPage(ev) {
        ev.preventDefault();
        if (mySidenav.style.display == "none") {
            rendition.next();
            document.body.scrollTop = 0;
        }
    };

    function _keyListener(ev){
        if ((ev.keyCode || ev.which) == 37) {
            _prevPage(ev);
        } else if ((ev.keyCode || ev.which) == 39) {
            _nextPage(ev);
        } else if ((ev.keyCode || ev.which) == 84) {
            // var event = new MouseEvent('mousedown');
            document.getElementById("toolbar").click();
        }
    };

    var mySidenav = document.getElementById('mySidenav');
    
    var prevNav = document.getElementById("prev-nav");
    var nextNav = document.getElementById("next-nav");
    var prevArrow = document.getElementById("prev-arrow");
    var nextArrow = document.getElementById("next-arrow");

    prevNav.addEventListener("click", (ev) => _prevPage(ev));
    nextNav.addEventListener("click", (ev) => _nextPage(ev));
    prevArrow.addEventListener("click", (ev) => _prevPage(ev));
    nextArrow.addEventListener("click", (ev) => _nextPage(ev));

    rendition.on("keyup", _keyListener);
    // rendition.on("relocated", function(location){
    //   console.log(location);
    // });

    document.addEventListener("keyup", _keyListener, false);
}


function prepareView() {
    if (!preparedView) {
        particleBackground.stop();
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


function submit() {
    prepareView();
    var text_input = document.getElementById("text-input");
    let is_valid = text_input.reportValidity();
    if (!is_valid)  return;
    createEpub(text_input.value);
}


function openBook(bookData){

    document.getElementById("prev-nav").removeAttribute("hidden");
    document.getElementById("next-nav").removeAttribute("hidden");
    document.getElementById("prev-arrow").removeAttribute("hidden");
    document.getElementById("next-arrow").removeAttribute("hidden");
    document.getElementById("viewer-wrapper").removeAttribute("hidden");
    document.getElementById("toolbar").style.removeProperty('display');
    document.getElementById("setup").remove();

    book.open(bookData, "binary");
    rendition = book.renderTo("viewer", {
        flow: "scrolled-doc",
        width: "100%",
        height: "100%",
        ignoreClass: 'annotator-hl',
        fullsize: true,
    });
    rendition.display();

    isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    font_size = isMobile? 18 : 23;

    rendition.themes.default({
        '*, h1, h2, h3, h4, h5, h6, p': {
            'background-color': '#fafafa !important', 
            'line-height': '1.5em !important',
            'color': '#111 !important',
            "font-family": `Helvetica-Light !important`,
        },
        "h1, h2, h3, h4, h5, h6": {
            "text-align": "center !important",
            "font-size": "larger !important",
            // "margin": "initial !important",
            // "padding": "initial !important",
        },
        "body": {
            'text-align': 'left !important',
            "font-size": `${font_size}px !important`,
        },
        "p": {
            "font-size": "inherit !important",
        }
    });

    // rendition.themes.fontSize(`${font_size}px`);
    rendition.themes.override("font-size", `${font_size}px`, true);

    toc(book);
    addons(rendition);
    destroyParticleBackground();
    
    // window.addEventListener("beforeunload", (ev) => false);
    window.onbeforeunload = ev => false;
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
            reader.addEventListener("load", ev => handleFile(ev, "epub"));
            reader.readAsArrayBuffer(epubZipContent);
        }
    });
}


var book = ePub();
var rendition, filename;
var font_size = 28;
var inputElement = document.getElementById("file-input");
var isMobile;

inputElement.addEventListener('change', function (ev) {
    var file = ev.target.files[0];
    var filename = file.name;
    var filetype = file.type;
    if (window.FileReader) {
        var reader = new FileReader();
        reader.addEventListener("load", ev => handleFile(ev, filetype));
        if (filetype.includes("epub")) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
        document.title = filename;
    }
});

inputElement.addEventListener("dragover", (ev) => ev.preventDefault());
inputElement.addEventListener("dragenter", (ev) => ev.preventDefault());

inputElement.addEventListener("drop", function(ev) {
    inputElement.files = ev.dataTransfer.files;
    var manual_ev = document.createEvent("HTMLEvents");
    manual_ev.initEvent("change", false, true);
    inputElement.dispatchEvent(manual_ev);
    ev.preventDefault();
});

var toolbarElement = document.getElementById("toolbar");
toolbarElement.addEventListener("click", function() {
    toggle_nav();
    toolbarElement.classList.toggle("active");
    if (toolbarElement.classList.contains("active")) {
        highlight_chapter();
    } else {
        fold_all();
    }
});

let grid_items = document.querySelectorAll(".grid-item");
grid_items.forEach((item) => {
    item.addEventListener("click", function() {
        switch(item.getAttribute("id")) {
            case "plus_btn":
                font_size += 1;
                break;
            case "minus_btn":
                font_size -= 1;
                break;
        }
        // rendition.themes.fontSize(`${font_size}px`);
        rendition.themes.override("font-size", `${font_size}px`, true);
    });
});

var resizeTimer = null,
    windowWidth = window.outerWidth;

window.addEventListener("resize", (resizeEvent) => {
    resizeEvent.stopImmediatePropagation();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.outerWidth !== windowWidth && rendition) {
            isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
            font_size = isMobile? 18 : 23;
            rendition.themes.override("font-size", `${font_size}px`, true);
            rendition.resize();
        }
        windowWidth = window.outerWidth;
    }, 500);
}, true);
