function fold_all() {
  $(".active").each(function(){
    $this = $(this)[0];
    $this.classList.toggle("active");
    if ($this.id == "toolbar") {
      $('#mySidenav').toggle()
    } else if ($this.id == "annotbar") {
      $('#extras').toggle()
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
        e.preventDefault();
        watchDouble += 1;
        setTimeout(() => {
          if (watchDouble === 2 && this.classList.contains("expandable")) {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            } 
          } else if (watchDouble === 1) {
            fold_all();
            var url = link.getAttribute("href");
            rendition.display(url);
            return false;
          }
          watchDouble = 0
        }, 200);
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

  var prev_page = function(e){
    rendition.prev();
    e.preventDefault();
  }

  var next_page = function(e){
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

  document.addEventListener("keyup", keyListener, false);

}

function highlight(book, rendition) {

  var highlights = document.getElementById('highlights');

  rendition.on("selected", function(cfiRange, contents) {
    var iframe = document.querySelectorAll('[id^="epubjs-view"]')[0];
    var idoc = iframe.contentDocument;
    $(idoc.body).one("contextmenu", function(e){
      e.preventDefault();
      var pos = $(this).parent().offset();
      // var width = $("#patient"+$(this).closest("tr").attr("id")).outerWidth();
      $("#hl").css({
        top: (e.pageY - pos.top + 50) + "px",
        left: (e.pageX - pos.left + 60) + "px"
      });
      $("#hl").toggle()
    }).one("click",function(){
      if ($("#hl").css("display") == "block") {
        $("#hl").toggle()
      }
    })
    $("#hl").one("click", function(){
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
          var link = document.createElement("a");
          link.className = "collapsible";
          link.textContent = chp_title;
          link.classList.toggle("expandable");
          let watchDouble = 0;
          link.onclick = function(e){
            e.preventDefault();
            watchDouble += 1;
            setTimeout(() => {
              if (watchDouble === 2) {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight){
                  content.style.maxHeight = null;
                } else {
                  content.style.maxHeight = content.scrollHeight + "px";
                } 
              } else if (watchDouble === 1) {
                fold_all();
                var confirmation = confirm(`Delete ${chp_title}?`)
                if (confirmation == true)
                  this.parentElement.remove();
                return false;
              }
              watchDouble = 0
            }, 200);
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
          link_sub.onclick = function(e){
            e.preventDefault();
            fold_all();
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
      $(this).toggle()
    })

  });

  // rendition.on("selected", function(cfiRange, contents) {
  //   $("#annotbar").one("contextmenu", function(e){
  //     e.preventDefault();
  //     rendition.annotations.highlight(cfiRange);

  //     book.getRange(cfiRange).then(function (range) {
  //       let locationCfi = rendition.currentLocation().start.cfi;
  //       let spineItem = book.spine.get(locationCfi);
  //       let navItem = book.navigation.get(spineItem.href);
  //       let chp_title = navItem.label.trim();

  //       let $target;
  //       let exist = false
  //       $("#highlights > li > a").each(function(e){
  //         if ($(this).text() == chp_title)
  //           exist = true;
  //           $target = $(this)[0];
  //       })
  //       if (!exist) {
  //         var item = document.createElement("li");
  //         var link = document.createElement("a");
  //         link.className = "collapsible";
  //         link.textContent = chp_title;
  //         let watchDouble = 0;
  //         link.onclick = function(e){
  //           e.preventDefault();
  //           watchDouble += 1;
  //           setTimeout(() => {
  //             if (watchDouble === 2) {
  //               this.classList.toggle("active");
  //               var content = this.nextElementSibling;
  //               if (content.style.maxHeight){
  //                 content.style.maxHeight = null;
  //               } else {
  //                 content.style.maxHeight = content.scrollHeight + "px";
  //               } 
  //             } else if (watchDouble === 1) {
  //               fold_all();
  //               var confirmation = confirm(`Delete ${chp_title}?`)
  //               if (confirmation == true)
  //                 this.parentElement.remove();
  //               return false;
  //             }
  //             watchDouble = 0
  //           }, 200);
  //         };
  //         var $div = document.createElement("div");
  //         $div.className = "content";
  //         var ul_sub = document.createElement("ul");
  //         item.appendChild(link);
  //         $div.appendChild(ul_sub);
  //         item.appendChild($div);
  //         highlights.appendChild(item);
  //         $target = link
  //       }

  //       var iframe = document.querySelectorAll('[id^="epubjs-view"]')[0];
  //       var idoc = iframe.contentDocument;
  //       var text = idoc.getSelection().toString();
  //       $(idoc.body).contextmenu(function(e){

  //         e.preventDefault();
  //         var pos = $(this).parent().offset();
  //         console.log($(this).parent())
  //         // var width = $("#patient"+$(this).closest("tr").attr("id")).outerWidth();
  //         $("#hl").css({
  //           top: (e.pageY - pos.top) + "px",
  //           left: (e.pageX - pos.left) + "px"
  //         });
  //         $("#hl").toggle()
  //       }).click(function(){
  //         if ($("#hl").css("display") == "block") {
  //           $("#hl").toggle()
  //         }
  //       })
  //       $("#hl").click(function(){
  //         $(this).toggle()
  //       })
  //       if (text.length > 0) {
  //         var item_sub = document.createElement("li");
  //         var link_sub = document.createElement("a");
  //         link_sub.className = "collapsible";
  //         link_sub.textContent = text;
  //         link_sub.onclick = function(e){
  //           e.preventDefault();
  //           fold_all();
  //           var confirmation = confirm(`Delete ${text}?`)
  //           if (confirmation == true)
  //             this.parentElement.remove();
  //           return false;
  //         };
  //         item_sub.appendChild(link_sub);
  //         var content = $target.nextElementSibling.lastChild;
  //         content.appendChild(item_sub);
          
  //         contents.window.getSelection().removeAllRanges();
  //       }
  //     });
  //   });
  // });

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

  font_size = isMobile? 21 : 28;
  rendition.themes.fontSize(`${font_size}px`);
  rendition.themes.default({
    '*': {
      'background': '#282923 !important', 
      'line-height': '1.65em !important',
      'color': '#f8f8f2 !important',
      'text-align': 'justify !important',
    },
    "h1, h2, h3, h4, h5, h6": {
      "text-align": "center !important",
      "font-size": "larger !important",
    },
  });
  rendition.themes.font("PingFangHK-Thin");
  addons(rendition);
  
  if (!isMobile) {
    highlight(book, rendition);
  }
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