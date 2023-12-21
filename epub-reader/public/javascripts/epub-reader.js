const userAgentParser = new UAParser(navigator.userAgent);
const userAgentParserResults = userAgentParser.getResult();
const userAgentOS = userAgentParserResults["os"].name
const userAgentBrowser = userAgentParserResults["browser"].name

function getWindowWidth() {
    return window.innerWidth;
}

function getZoomLevel() {
    if (userAgentOS === "Mac OS" || userAgentOS === "iOS") {
        if (userAgentBrowser.includes("Safari")) {
            return Math.round(((window.outerWidth) / window.innerWidth) * 100) / 100;
        } else {
            return window.devicePixelRatio / 2;
        }
    } else {
        return window.devicePixelRatio;
    }
    
}

function checkIsMobile() {
    return window.matchMedia("only screen and (max-width: 760px)").matches
}

function toggleNav() {
    let mySidenav = document.getElementById("mySidenav");
    mySidenav.classList.toggle("hidden");
    let toolbarBottons = document.getElementById("toolbar-bottons");
    toolbarBottons.classList.toggle("hidden");
}

function foldAll() {
    let elems = document.querySelectorAll("#epub_config .active");
    elems.forEach((elem) => {
        elem.classList.remove("active");
        if (elem.id == "toolbar") {
            toggleNav();
        } else if (elem.classList.contains("expandable")) {
            elem.nextElementSibling.style.maxHeight = null;
        }
    });
}

class EpubReader {
    constructor(bookData) {
        this.book = ePub();
        this.supposedFontSize = null;
        this.adjustedFontSize = null;
        this.resizeTimer = null;
        this.windowWidth = getWindowWidth();
        this.wasMobile = checkIsMobile();
        this.prevZoomLevel = getZoomLevel();

        this.fontSizeKey = "epubReaderFontSize";
        this.openBook(bookData);
        this.monitorResize();
    }

    monitorResizeHandler() {
        const windowWidth = getWindowWidth();
        if (windowWidth === this.windowWidth || !this.rendition) {
            return
        }

        var fontSize = null;
        const isMobile = checkIsMobile();
        const zoomLevel = getZoomLevel();
        if (isMobile !== this.wasMobile) {
            const [supposedFontSize, adjustedFontSize] = this.getInitialFontSize();
            this.supposedFontSize = supposedFontSize;
            fontSize = adjustedFontSize;
            console.log("major size change", fontSize);
        } else if (zoomLevel !== this.prevZoomLevel) {
            fontSize = this.getAdjustedFontSize(this.supposedFontSize);
            console.log("minor size change", fontSize);
        }
        this.wasMobile = isMobile;
        this.prevZoomLevel = zoomLevel;
        this.windowWidth = windowWidth;

        if (fontSize && fontSize !== this.adjustedFontSize) {
            this.adjustedFontSize = fontSize;
            this.rendition.themes.override("font-size", `${this.adjustedFontSize}px`, true);
        }
        this.rendition.resize();
    }

    monitorResize() {
        window.addEventListener("resize", (resizeEvent) => {
            resizeEvent.stopImmediatePropagation();
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.monitorResizeHandler();
            }, 500);
        }, true);
    }

    openBook(bookData){
        this.book.open(bookData, "binary");
        this.rendition = this.book.renderTo("viewer", {
            flow: "scrolled-doc",
            width: "100%",
            height: "100%",
            ignoreClass: 'annotator-hl',
            fullsize: true,
        });
        this.rendition.display();

        if (this.supposedFontSize === null || this.adjustedFontSize === null) {
            const [supposedFontSize, adjustedFontSize] = this.getInitialFontSize();
            this.supposedFontSize = supposedFontSize;
            this.adjustedFontSize = adjustedFontSize;
        }
        this.rendition.themes.default({
            '*, h1, h2, h3, h4, h5, h6, p': {
                'background-color': '#fafafa !important', 
                'line-height': '1.5em !important',
                'color': '#111 !important',
                "font-family": "Helvetica !important",
                "font-weight": "100 !important",
            },
            "h1, h2, h3, h4, h5, h6": {
                "text-align": "center !important",
                "font-size": "larger !important",
                // "margin": "initial !important",
                // "padding": "initial !important",
            },
            "body": {
                "width": "100% !important",
                "padding": "0 !important",
                "margin": "0 !important",
                'text-align': 'left !important',
                "font-size": `${this.adjustedFontSize}px !important`,
            },
            "p": {
                "font-size": "inherit !important",
            }
        });
        this.setCurrentFontSize(this.adjustedFontSize);

        this.parseToc();
        this.addons();
    }

    _add_toc(chapter) {
        var item = document.createElement("li");
        var link = document.createElement("div");
        link.classList.add("links");
        link.classList.add("collapsible");
        link.textContent = chapter.label;
        link.setAttribute("data-href", chapter.href);
        link.addEventListener("click", (event) => {
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
                foldAll();
                var url = link.getAttribute("data-href");
                this.rendition.display(url).then(() => {
                    let hrefComponents = url.split("#");
                    if (hrefComponents.length > 1) {
                        let iframeWindow = this.rendition.getContents()[0].window;
                        // let iframeWindow = document.querySelector('#viewer iframe[id^="epubjs-view"]').contentWindow;
                        if (hrefComponents[0] === this.rendition.location.end.href) {
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
        // if (this.book.spine.spineByHref[chapter.href] !== undefined) {
        //     link.id = chapter.href;
        // }

        if (chapter.subitems.length !== 0) {
            link.classList.toggle("expandable");
        }

        item.appendChild(link);

        var $div = document.createElement("div");
        $div.classList.add("content");

        var ul_sub = document.createElement("ul");
        chapter.subitems.forEach((chapter_sub) => {
            let item_sub = this._add_toc(chapter_sub);
            ul_sub.appendChild(item_sub);
        });

        $div.appendChild(ul_sub);
        item.appendChild($div);

        return item;
    }

    parseToc() {
        this.book.loaded.navigation.then((toc) => {
            var $ul = document.getElementById("tocs");
            toc.forEach((chapter) => {
                var item = this._add_toc(chapter);
                $ul.appendChild(item);
            });
        });
    }

    prevPage() {
        this.rendition.prev();
        document.body.scrollTop = 0;
    };

    nextPage() {
        this.rendition.next();
        document.body.scrollTop = 0;
    };

    addons() {
        const keyListener = (event) => {
            if ((event.keyCode || event.which) == 37) {
                this.prevPage();
            } else if ((event.keyCode || event.which) == 39) {
                this.nextPage();
            } else if ((event.keyCode || event.which) == 84) {
                document.getElementById("toolbar").click();
            } else {
                return;
            }
            event.preventDefault();
        };

        this.rendition.on("keyup", keyListener);
        document.addEventListener("keyup", keyListener, false);
    }

    // unused
    _addChapterCfi(href) {
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

    _findVisibleAnchor(href) {
        // const iframeWindow = document.querySelector('#viewer iframe[id^="epubjs-view"]').contentWindow;
        // const anchors = iframeWindow.document.body.querySelectorAll(`[id]`);
        const anchors = this.rendition.getContents()[0].content.querySelectorAll(`[id]`);
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

    _activateLink(link) {
        if (link == null) {
            return false;
        }

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
        link.scrollIntoView({behavior: "instant", block: "center", inline: "nearest"});
        return true;
    }

    highlightChapter() {
        const href = this.rendition.location.end.href;
        const hrefWithAnchor = this._findVisibleAnchor(href);
        // this._addChapterCfi(href);

        const elem = document.getElementById(hrefWithAnchor) || document.getElementById(href)
        var activated = this._activateLink(elem);
        let firstLink = null;
        if (!activated) {
            let links = document.querySelectorAll("#tocs div.links.collapsible");
            for (const link of links) {
                const linkHref = link.getAttribute("data-href");
                if (linkHref.startsWith(href)) {
                    if (!linkHref)  firstLink = link;
                    if (linkHref.startsWith(hrefWithAnchor)) {
                        this._activateLink(link)
                        break;
                    }
                } else if (firstLink !== null) {
                    this._activateLink(firstLink);
                    break;
                }
            };
        }
    }

    setCurrentFontSize(fontSize) {
        // this.rendition.themes.fontSize(`${fontSize}px`);
        this.rendition.themes.override("font-size", `${fontSize}px`, true);
        localStorage.setItem(this.fontSizeKey, fontSize);
    }

    getInitialFontSize() {
        let fontSize = this.getPreferredFontSize();
        return [fontSize, this.getAdjustedFontSize(fontSize)];
    }

    getStoredFontSize() {
        const fontSize = localStorage.getItem(this.fontSizeKey);
        return fontSize ? Number(fontSize) : null;
    }

    getPreferredFontSize() {
        const isMobile = checkIsMobile();
        const fontSize = isMobile? 18 : 23;
        return fontSize;
    }

    getAdjustedFontSize(fontSize) {
        const zoomLevel = getZoomLevel();
        return fontSize / zoomLevel;
    }

    changeFontSize(isIncrement) {
        const level = this.getAdjustedFontSize(1);
        if (isIncrement) {
            this.supposedFontSize += 1;
            this.adjustedFontSize += level;
        } else {
            this.supposedFontSize -= 1;
            this.adjustedFontSize -= level;
        }
        this.setCurrentFontSize(this.adjustedFontSize);
    }
}

export { toggleNav, foldAll, EpubReader };
