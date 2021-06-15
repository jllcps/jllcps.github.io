function toc(book){
  book.loaded.navigation.then(function(toc){
    var $nav = document.getElementById("mySidenav");
        // docfrag = document.createDocumentFragment();

    // var $ul = document.createElement("ul");
    var $ul = document.getElementById("tocs");

    toc.forEach(function(chapter) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.className = "collapsible";
      link.textContent = chapter.label;
      link.href = chapter.href;
      link.onclick = function(e){
        if (e.detail === 1) {
          $(".active").each(function(){
            $this = $(this)[0];
            $this.classList.toggle("active");
            $this.lastChild.style.maxHeight = null;
          })
          if ($('#mySidenav').css("display") != "none") {
            $('#mySidenav').toggle()
          }
          if ($('#extras').css("display") != "none") {
            $('#mySidenav').toggle()
          }
          var url = link.getAttribute("href");
          rendition.display(url);
          return false;
        }
      };
      item.ondblclick = function() {
        this.classList.toggle("active");
        var content = this.lastChild;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        } 
      };
      item.appendChild(link);

      var $div = document.createElement("div");
      $div.className = "content";
      var ul_sub = document.createElement("ul");
      chapter.subitems.forEach(function(chp) {
        var item_sub = document.createElement("li");
        var link_sub = document.createElement("a");
        link_sub.className = "collapsible";
        link_sub.textContent = chp.label;
        link_sub.href = chp.href;
        link_sub.onclick = function(){
          $(".active").each(function(){
            $this = $(this)[0];
            $this.classList.toggle("active");
            $this.lastChild.style.maxHeight = null;
          })
          if ($('#mySidenav').css("display") != "none") {
            $('#mySidenav').toggle()
          }
          if ($('#extras').css("display") != "none") {
            $('#mySidenav').toggle()
          }
          // $(".active").dblclick();
          var url_sub = link_sub.getAttribute("href");
          rendition.display(url_sub);
          // $(".active").removeClass("active");
          return false;
        };
        item_sub.appendChild(link_sub);
        ul_sub.appendChild(item_sub);
      })      
      $div.appendChild(ul_sub)
      item.appendChild($div);

      $ul.appendChild(item);
    });
    
    // docfrag.appendChild($ul);
    // $nav.appendChild(docfrag);

  });

}

function addons(rendition){
  document.getElementById("toolbar").style.removeProperty('display');
  document.getElementById("annotbar").style.removeProperty('display');

  var keyListener = function(e){
    if ((e.keyCode || e.which) == 37) {
      rendition.prev();
    }
    if ((e.keyCode || e.which) == 39) {
      rendition.next();
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

  next.addEventListener("click", function(e){
      rendition.next();
      e.preventDefault();
  }, false);

  prev.addEventListener("click", function(e){
      rendition.prev();
      e.preventDefault();
  }, false);

  // window.addEventListener('beforeunload', function (e) {
  //   localStorage.setItem(filename, rendition.location.start.cfi);
  //   e.returnValue = '';
  // });

  document.addEventListener("keyup", keyListener, false);

}

function highlight(book, rendition) {

  var highlights = document.getElementById('highlights');

  rendition.on("selected", function(cfiRange, contents) {
    $("#annotbar").one("contextmenu", function(e){
      e.preventDefault();
      rendition.annotations.highlight(cfiRange);

      book.getRange(cfiRange).then(function (range) {
        let locationCfi = rendition.currentLocation().start.cfi;
        let spineItem = book.spine.get(locationCfi);
        let navItem = book.navigation.get(spineItem.href);
        let chp_title = navItem.label.trim();

        let $target;
        let exist = false
        $("#highlights > li > a").each(function(e){
          if ($(this).text() == chp_title)
            exist = true;
            $target = $(this)[0];
        })
        if (!exist) {
          var item = document.createElement("li");
          item.addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.lastChild;
            if (content.style.maxHeight){
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            } 
          });
          var link = document.createElement("a");
          link.className = "collapsible";
          link.textContent = chp_title;
          link.onclick = function(){
            $(".active").each(function(){
              $this = $(this)[0];
              $this.classList.toggle("active");
              $this.lastChild.style.maxHeight = null;
            })
            if ($('#mySidenav').css("display") != "none") {
              $('#mySidenav').toggle()
            }
            if ($('#extras').css("display") != "none") {
              $('#mySidenav').toggle()
            }
            // $(".active").click();
            var confirmation = confirm(`Delete ${chp_title}?`)
            if (confirmation == true)
              this.parentElement.remove();
            // $(".active").removeClass("active");
            return false;
          };
          var $div = document.createElement("div");
          $div.className = "content";
          var ul_sub = document.createElement("ul");
          item.appendChild(link);
          $div.appendChild(ul_sub);
          item.appendChild($div);
          highlights.appendChild(item);
          $target = link
        }

        var iframe = document.querySelectorAll('[id^="epubjs-view"]')[0];
        var idoc = iframe.contentDocument;
        var text = idoc.getSelection().toString();

        if (text.length > 0) {
          var item_sub = document.createElement("li");
          var link_sub = document.createElement("a");
          link_sub.className = "collapsible";
          link_sub.textContent = text;
          link_sub.onclick = function(){
            $(".active").click();
            $(".active").removeClass("active");
            var confirmation = confirm(`Delete ${text}?`)
            if (confirmation == true)
              this.parentElement.remove();
            return false;
          };
          item_sub.appendChild(link_sub);
          var content = $target.nextElementSibling.lastChild;
          content.appendChild(item_sub);
          
          contents.window.getSelection().removeAllRanges();
        }
      });
    });
  });

}

function openBook(e){
  var bookData = e.target.result;
  var next = document.getElementById("next");
  var prev = document.getElementById("prev");

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

  rendition.themes.default({
    '*': {
      'background': '#282923 !important', 
      'font-family': 'PingFangHK-Thin, sans-serif !important',
      'line-height': '1.8em !important',
      'color': '#f8f8f2 !important',
      //'text-align': 'justify !important',
      // 'font-size': '28px',
    }
  });

  addons(rendition);
  
  let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
  if (!isMobile) {
    highlight(book, rendition);
  } else {
    font_size = 24
  }
  rendition.themes.fontSize(`${font_size}px`);

}

function buildAnnotation(){
  var annotation = []
  $("#highlights > li").each(function(){
    let $this = $(this);
    if ($this.children("a")) {
      let chp = $this.children("a").text();
      let annot = []
      $this.find(".content a").each(function(){
        annot.push($(this).text())
      })
      if (annot.length > 0) {
        annotation.push({"chp": chp, "annot": annot});
      }
    }
  })
  return annotation

}

function saveAnnotation(){

  let annotation = buildAnnotation();
  let tmp_str = "";
  for (i in annotation) {
    tmp_str += ("### " + annotation[i]["chp"])
    for (j in annotation[i]["annot"]) {
      tmp_str += ("\n - " + annotation[i]["annot"][j])
    }
    tmp_str += "\n\n\n"
  }
  var blob = new Blob([tmp_str],
      { type: "text/plain;charset=utf-8" });
  saveAs(blob, `${filename}_annotation.md`);  

}