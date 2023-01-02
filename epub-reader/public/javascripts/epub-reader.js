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

    function add_chapter_cfi(href) {
        let section = document.getElementById(href);
        if (section.getAttribute("data-checked")) {
            return;
        }

        const spineId = book.spine.spineByHref[href];
        const spineItem = book.spine.spineItems[spineId];

        let links = document.querySelectorAll(`a.collapsible[href^='${href}']`);
        links.forEach((link) => {
            const hrefComponents = link.getAttribute("href").split("#");
            if (hrefComponents.length === 1) {
                link.setAttribute("data-checked", true);
            } else if (hrefComponents.length !== 2) {
                return;
            }

            const elem = spineItem.document.getElementById(hrefComponents[1]);
            const cfi = spineItem.cfiFromElement(elem);
            link.setAttribute('data-cfi', cfi);
        });

        // $(`a.collapsible[href^='${href}']`).each(function(){
        //     let $this = $(this);

        //     const hrefComponents = $this.attr("href").split("#");
        //     if (hrefComponents.length === 1) {
        //         $this.attr("data-checked", true);
        //     } else if (hrefComponents.length !== 2) {
        //         return;
        //     }

        //     const elem = spineItem.document.getElementById(hrefComponents[1]);
        //     const cfi = spineItem.cfiFromElement(elem);
        //     $this.attr('data-cfi', cfi);
        // });
    }

    var href = rendition.location.end.href;
    // add_chapter_cfi(href);

    let links = document.querySelectorAll("a.collapsible");
    links.forEach((link) => {
        if (link.getAttribute("href").startsWith(href)) {
            link.classList.toggle("active");
            let elem = link.parentNode;
            while (elem) {
                if (elem.tagName === "DIV") {
                    if (elem.className === "content") {
                        let parent_a = elem.previousElementSibling;
                        parent_a.classList.toggle("active");
                        elem.style.maxHeight = elem.scrollHeight + "px";
                    } else if (elem.className === "sidenav") {
                        let content = link.nextElementSibling;
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                }
                elem = elem.parentNode;
            }
            link.scrollIntoView({block: "center", inline: "nearest"});
            return false;
        }
    });

    // $("a.collapsible").each(function(){
    //     let $this = $(this);
    //     if ($this.attr("href").startsWith(href)) {
    //         $this[0].classList.toggle("active");
    //         $this.parents("div").each(function(){
    //             let $$this = $(this);
    //             if ($$this.attr('class') == "content") {
    //                 let parent_a = $$this.prev("a")[0];
    //                 parent_a.classList.toggle("active");
    //                 let content = parent_a.nextElementSibling;
    //                 content.style.maxHeight = content.scrollHeight + "px";
    //             } else if ($$this.attr('class') == "sidenav") {
    //                 let content = $this[0].nextElementSibling;
    //                 content.style.maxHeight = content.scrollHeight + "px";
    //             }
    //         });

    //         $this[0].scrollIntoView({block: "center", inline: "nearest"});
    //         return false;
    //     }
    // });
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
    
    let elems = document.querySelectorAll(".active");
    elems.forEach((elem) => {
        elem.classList.toggle("active");
        if (elem.id == "toolbar") {
            toggle_nav();
            // $('#mySidenav').toggle();
        } else if (elem.classList.contains("expandable")) {
            elem.nextElementSibling.style.maxHeight = null;
        }
    });

    // $(".active").each(function(){
    //     $this = $(this)[0];
    //     $this.classList.toggle("active");
    //     if ($this.id == "toolbar") {
    //         $('#mySidenav').toggle();
    //     } else if ($this.classList.contains("expandable")) {
    //         $this.nextElementSibling.style.maxHeight = null;
    //     }
    // });
}


function toc(book){

    function add_toc(chapter) {
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.className = "collapsible";
        link.textContent = chapter.label;
        link.href = chapter.href;
        link.onclick = function(e) {
            e.preventDefault();
            if (this.classList.contains("expandable")) {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight){
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    let elem = this.parentNode;
                    while (elem) {
                        if (elem.className === "content") {
                            elem.style.maxHeight = elem.scrollHeight + "px";
                        }
                        elem = elem.parentNode;
                    }

                    // $(this).parents(".content").each(function(){
                    //     $(this).css("maxHeight", $(this).prop('scrollHeight'));
                    // });
                } 
            } else {
                fold_all();
                var url = link.getAttribute("href");
                rendition.display(url).then(() => {
                    setTimeout(() => {
                        let url_component = url.split("#");
                        if (url_component.length > 1) {
                            anchor = url_component[1];
                            epubjs_view = document.querySelector('[id^="epubjs-view"]').contentWindow;
                            epubjs_view.location.hash = anchor;
                        }
                    }, 300);
                });
                return false;
            }
        };

        if (book.spine.spineByHref[chapter.href] !== undefined) {
            link.id = chapter.href;
        }

        if (chapter.subitems.length !== 0) {
            link.classList.toggle("expandable");
        }

        item.appendChild(link);

        var $div = document.createElement("div");
        $div.className = "content";

        var ul_sub = document.createElement("ul");
        chapter.subitems.forEach(function(chapter_sub) {
            item_sub = add_toc(chapter_sub);
            ul_sub.appendChild(item_sub);
        });

        $div.appendChild(ul_sub);
        item.appendChild($div);

        return item;
    }

    book.loaded.navigation.then(function(toc){
        var $ul = document.getElementById("tocs");
        toc.forEach(function(chapter) {
            var item = add_toc(chapter);
            $ul.appendChild(item);
        });

    });
}


function addons(rendition){
    var mySidenav = document.getElementById('mySidenav');

    document.getElementById("toolbar").style.removeProperty('display');

    var prev_page = function(ev){
        ev.preventDefault();
        if (mySidenav.style.display == "none") {
            rendition.prev();
            document.body.scrollTop = 0;
        }
    };

    var next_page = function(ev){
        ev.preventDefault();
        if (mySidenav.style.display == "none") {
            rendition.next();
            document.body.scrollTop = 0;
        }
    };
    
    var next = document.getElementById("next");
    var prev = document.getElementById("prev");
    var next_nav = document.getElementById("next_nav");
    var prev_nav = document.getElementById("prev_nav");

    prev.onclick = (ev) => prev_page(ev);
    next.onclick = (ev) => next_page(ev);
    prev_nav.onclick = (ev) => prev_page(ev);
    next_nav.onclick = (ev) => next_page(ev);

    var keyListener = function(ev){
        if ((ev.keyCode || ev.which) == 37) {
            prev_page(ev);
        }
        if ((ev.keyCode || ev.which) == 39) {
            next_page(ev);
        }
        if ((ev.keyCode || ev.which) == 84) {
            // var event = new MouseEvent('mousedown');
            document.getElementById("toolbar").click();
        }
    };

    rendition.on("keyup", keyListener);
    // rendition.on("relocated", function(location){
    //   console.log(location);
    // });

    document.addEventListener("keyup", keyListener, false);
}


function handleFile(ev, filetype){
    var bookData = ev.target.result;
    if (filetype.includes("epub")) {
        openBook(bookData);
    } else {
        createEpub(bookData);
    }
}


function submit() {
    var text_input = document.getElementById("text-input");
    let is_valid = text_input.reportValidity();
    if (!is_valid)  return;
    createEpub(text_input.value);
}


function openBook(bookData){

    book.open(bookData, "binary");
    toc(book);

    rendition = book.renderTo("viewer", {
        flow: "scrolled-doc",
        width: "100%",
        height: "100%",
        ignoreClass: 'annotator-hl',
        fullsize: true,
    });

    document.getElementById("setup").remove();
    document.getElementById("particle").remove();
    document.getElementsByClassName('arrow')[0].style.removeProperty('display');
    document.getElementsByClassName('arrow')[1].style.removeProperty('display');

    rendition.display();

    let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
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

    addons(rendition);
    
    window.onbeforeunload = ev => false;
}


function createEpub(text) {
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

    var add_chapter = function(section, next_level, add_parent) {
        let lastEntry = (list) => list[list.length-1];
        let proceed = section_stack.length >= 2 && (add_parent || next_level <= lastEntry(number_stack));
        let spine = section_stack.pop(),
            spine_level = number_stack.pop();
        if (spine instanceof EpubMaker) {
            spine = spine.withSection(section);
        } else {
            spine = spine.withSubSection(section);
            if (proceed) {
                add_chapter(spine, next_level, next_level <= lastEntry(number_stack));
            }
        }
        if (!proceed) {
            section_stack.push(spine);
            number_stack.push(spine_level);
        }
    };

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
            add_chapter(section, next_level, false);
        } else {
            add_chapter(section, next_level, true);
        }

        if (idx == matches.length - 2) {
            start_index = next_match.index + next_match[0].length;
            ending_index = text.length;

            content = text.slice(start_index, ending_index).replaceAll("\n", "<br />");
            section = new EpubMaker.Section(null, `text-${idx+1}`, { title: next_match[1], content: content }, true, false);

            add_chapter(section, 1, true);
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
            reader.onload = ev => handleFile(ev, "epub");
            reader.readAsArrayBuffer(epubZipContent);
        }
    });
}


var book = ePub();
var rendition, filename;
var font_size = 28;
var inputElement = document.getElementById("file-input");
var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

inputElement.addEventListener('change', function (ev) {
    var file = ev.target.files[0];
    var filename = file.name;
    var filetype = file.type;
    if (window.FileReader) {
        var reader = new FileReader();
        reader.onload = ev => handleFile(ev, filetype);

        if (filetype.includes("epub")) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
        document.title = filename;
    }
});

var toolbarElement = document.getElementById("toolbar");
toolbarElement.addEventListener("click", function() {
    // $('#mySidenav').toggle();
    toggle_nav();
    this.classList.toggle("active");
    if (this.classList.contains("active")) {
        highlight_chapter();
    } else {
        fold_all();
    }
});

let grid_items = document.querySelectorAll(".grid-item");
grid_items.forEach((item) => {
    item.addEventListener("click", function() {
        switch(this.getAttribute("id")) {
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

// $(".grid-item").click(function(){
//     switch($(this).attr("id")) {
//         case "plus_btn":
//             font_size += 1;
//             break;
//         case "minus_btn":
//             font_size -= 1;
//             break;
//         }
//     // rendition.themes.fontSize(`${font_size}px`);
//     rendition.themes.override("font-size", `${font_size}px`, true);
// });
