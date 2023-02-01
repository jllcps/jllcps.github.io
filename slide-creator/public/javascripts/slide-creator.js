
var timer;
var init_width = false;
var presenter = document.getElementById("presenter");

const marp = new Marp.getMarp({
    inlineSVG: false,
});


function set_iframe_style(){
    let innerStyle = document.createElement('style');
    innerStyle.id = 'innerStyle';
    presenter.contentWindow.document.head.appendChild(innerStyle);

    let defaultStyle = document.createElement('style');
    defaultStyle.id = 'defaultStyle';
    presenter.contentWindow.document.head.appendChild(defaultStyle);

    presenter.contentWindow.document.body.style.overflowX = "hidden";
}


function scale_iframe(){
    presenter.contentWindow.document.body.style.zoom = 1;
    let ratio = presenter.offsetWidth / presenter.contentWindow.document.body.scrollWidth;
    let defaultStyle = presenter.contentWindow.document.getElementById("defaultStyle");
    presenter.contentWindow.document.body.style.zoom = ratio;
}


function compare() {
    var text_elem = document.getElementById('text');

    const { html, css } = marp.render(text_elem.value);

    const htmlFile = `<!DOCTYPE html><html><body><style>${css}</style>${html}</body></html>`;
    var additionalWindow = window.open("template.html");
    additionalWindow.document.write(htmlFile);

    // window.setTimeout(() => {

    // }, 1000);

    // let innerStyle = presenter.contentWindow.document.getElementById("innerStyle");

    // presenter.contentWindow.document.body.innerHTML = html;
    // innerStyle.innerHTML = css;

    // if (!init_width) {
    //     scale_iframe();
    //     init_width = true;
    // }
}


function init() {
    set_iframe_style();
    window.onresize = ev => {
        window.clearTimeout(timer);
        timer = window.setTimeout(scale_iframe, 100);
    };
    window.onbeforeunload = ev => false;
}


init();

// dragElement(document.getElementById("mydiv"));

// function dragElement(elmnt) {
//   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   if (document.getElementById(elmnt.id + "header")) {
//     // if present, the header is where you move the DIV from:
//     document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//   } else {
//     // otherwise, move the DIV from anywhere inside the DIV: 
//     elmnt.onmousedown = dragMouseDown;
//   }

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//   }

//   function closeDragElement() {
//     // stop moving when mouse button is released:
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }