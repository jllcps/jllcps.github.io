function highlight_chapter() {
    href = rendition.location.end.href
    $("a.collapsible").each(function(){
        $this = $(this);
        if ($this.attr("href").startsWith(href)) {
            $this[0].classList.toggle("active");
            closest_div = $this.closest("div");
            if (closest_div.attr('class') == "content") {
                closest_a = closest_div.prev("a")[0];
                closest_a.classList.toggle("active");
                var content = closest_a.nextElementSibling;
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                var content = $this[0].nextElementSibling;
                content.style.maxHeight = content.scrollHeight + "px";
            }
            return
        }
    })
}

function fold_all() {
    $(".active").each(function(){
        $this = $(this)[0];
        $this.classList.toggle("active");
        if ($this.id == "toolbar") {
            $('#mySidenav').toggle()
        } else if ($this.classList.contains("expandable")) {
            $this.nextElementSibling.style.maxHeight = null;
        }
    })
}

function toc(book){
    book.loaded.navigation.then(function(toc){

        var $ul = document.getElementById("tocs");
        toc.forEach(function(chapter) {
            var item = document.createElement("li");
            var link = document.createElement("a");
            link.className = "collapsible";
            link.textContent = chapter.label;
            link.href = chapter.href;
            let watchDouble = 0;
            link.onclick = function(e) {
                e.preventDefault();
                // watchDouble += 1;
                // setTimeout(() => {
                    // if (watchDouble === 2 && this.classList.contains("expandable")) {
                    if (this.classList.contains("expandable")) {
                        this.classList.toggle("active");
                        var content = this.nextElementSibling;
                        if (content.style.maxHeight){
                            content.style.maxHeight = null;
                        } else {
                            content.style.maxHeight = content.scrollHeight + "px";
                        } 
                    // } else if (watchDouble === 1) {
                    } else {
                        fold_all();
                        var url = link.getAttribute("href");
                        rendition.display(url);
                        return false;
                    }
                    // watchDouble = 0
                // }, 200);
            };
            // link.ondblclick = function(e) {
            //   e.preventDefault();
            //   this.classList.toggle("active");
            //   var content = this.lastChild;
            //   if (content.style.maxHeight){
            //     content.style.maxHeight = null;
            //   } else {
            //     content.style.maxHeight = content.scrollHeight + "px";
            //   } 
            // };
            item.appendChild(link);

            var $div = document.createElement("div");
            $div.className = "content";

            var ul_sub = document.createElement("ul");
            if (chapter.subitems.length !== 0) {
                link.classList.toggle("expandable");
            }

            chapter.subitems.forEach(function(chp) {
                var item_sub = document.createElement("li");
                var link_sub = document.createElement("a");
                link_sub.className = "collapsible";
                link_sub.textContent = chp.label;
                link_sub.href = chp.href;
                link_sub.onclick = function(e){
                    e.preventDefault();
                    fold_all();
                    var url_sub = link_sub.getAttribute("href");
                    rendition.display(url_sub);
                    return false;
                };
                item_sub.appendChild(link_sub);
                ul_sub.appendChild(item_sub);
            })      
            $div.appendChild(ul_sub)
            item.appendChild($div);

            $ul.appendChild(item);
        });

    });

}

function addons(rendition){
    var mySidenav = document.getElementById('mySidenav');

    document.getElementById("toolbar").style.removeProperty('display');

    var prev_page = function(e){
        e.preventDefault();
        if (mySidenav.style.display == "none") {
            rendition.prev();
            document.body.scrollTop = 0;      
        }
    }

    var next_page = function(e){
        e.preventDefault();
        if (mySidenav.style.display == "none") {
            rendition.next();
            document.body.scrollTop = 0;
        }
    }
    
    var next = document.getElementById("next");
    var prev = document.getElementById("prev");
    var next_nav = document.getElementById("next_nav");
    var prev_nav = document.getElementById("prev_nav");

    prev.onclick = (e) => prev_page(e);
    next.onclick = (e) => next_page(e);
    prev_nav.onclick = (e) => prev_page(e);
    next_nav.onclick = (e) => next_page(e);

    var keyListener = function(e){
        if ((e.keyCode || e.which) == 37) {
            prev_page(e);
        }
        if ((e.keyCode || e.which) == 39) {
            next_page(e);
        }
        if ((e.keyCode || e.which) == 84) {
            var event = new MouseEvent('mousedown');
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
    rendition.themes.fontSize(`${font_size}px`);
    rendition.themes.default({
        '*': {
            'background-color': '#fafafa !important', 
            'line-height': '1.5em !important',
            'color': '#111 !important',
            'text-align': 'justify !important',
            "font-family": `Helvetica-Light !important`
        },
        "h1, h2, h3, h4, h5, h6": {
            "text-align": "center !important",
            "font-size": "larger !important",
        },
    });

    addons(rendition);
    
    window.onbeforeunload = ev => false;
}


function createEpub(text) {
    replace_dict = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "\n": "<br />"
    };

    for (symbol in replace_dict) {
        text = text.replaceAll(symbol, replace_dict[symbol]);
    }

    const filename = 'untitled';
    let epubMaker = new EpubMaker()
        .withTemplate('idpf-wasteland')
        // .withLanguage('en-GB')
        .withTitle(filename)
        .withSection(new EpubMaker.Section(null, null, { content: text }, false, false));

    epubMaker.makeEpub().then(function(epubZipContent) {
        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = ev => handleFile(ev, "epub");
            reader.readAsArrayBuffer(epubZipContent);
            document.title = filename;
        }
    })
}