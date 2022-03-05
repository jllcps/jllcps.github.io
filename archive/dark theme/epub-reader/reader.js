function fold_all() {
  $(".active").each(function(){
    $this = $(this)[0];
    $this.classList.toggle("active");
    if ($this.id == "toolbar") {
      $('#mySidenav').toggle()
    } else {
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
        // e.preventDefault();
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
  document.getElementById("toolbar").style.removeProperty('display');

  var prev_page = function(e){
    // window.scrollTo(0, 0);
    rendition.prev();
    e.preventDefault();
  }

  var next_page = function(e){
    // window.scrollTo(0, 0);
    rendition.next();
    e.preventDefault();
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


function openBook(e){
  var bookData = e.target.result;

  book.open(bookData, "binary");
  toc(book);

  rendition = book.renderTo("viewer", {
    flow: "scrolled-doc",
    width: "100%",
    height: "100%",
    ignoreClass: 'annotator-hl',
    fullsize: true,
  });
  
  // var loc = localStorage.getItem(filename);
  // if (loc !== null) {
  //   rendition.display(loc);
  //   localStorage.removeItem(filename)
  // } else {
  //   rendition.display();
  // }

  rendition.display();

  let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

  font_size = isMobile? 20 : 25;
  rendition.themes.fontSize(`${font_size}px`);
  rendition.themes.default({
    '*': {
      'background-color': '#282923 !important', 
      'line-height': '1.5em !important',
      'color': '#f8f8f8 !important',
      'text-align': 'justify !important',
      "font-family": `Helvetica-Light !important`
    },
    "h1, h2, h3, h4, h5, h6": {
      "text-align": "center !important",
      "font-size": "larger !important",
    },
  });

  addons(rendition);
  
  window.onbeforeunload = e => false;
}