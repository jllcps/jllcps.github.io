var a = document.getElementById('a');
var b = document.getElementById('b');
var result = document.getElementById('result');


let tmp = Diff.structuredPatch('','',a.textContent, b.textContent,'left','right', {"context": 3});
formatPatch(tmp);

function formatPatch(diff) {
  var bold_li = [];
  var fragment = document.createDocumentFragment();

  if (diff.oldFileName == diff.newFileName) {
    bold_li.push('Index: ' + diff.oldFileName);
  }

  bold_li.push('===================================================================');
  bold_li.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
  bold_li.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));

  bold_li.forEach(function(text){
    span = document.createElement('span');
    span.style.fontWeight = "bold";
    span.appendChild(document.createTextNode(text));
    fragment.appendChild(span);
    br = document.createElement('br');
    fragment.appendChild(br);
  });

  diff.hunks.forEach(function(hunk){
    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1;
    }

    if (hunk.newLines === 0) {
      hunk.newStart -= 1;
    }

    let range = '@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@';
    span = document.createElement('span');
    span.style.color = "cyan";
    span.appendChild(document.createTextNode(range));
    fragment.appendChild(span);
    br = document.createElement('br');
    fragment.appendChild(br);

    hunk.lines.forEach(function(line){
      color = line[0] === "+" ? 'green' :
        line[0] === "-" ? 'red' : 'grey';
      span = document.createElement('span');
      span.style.color = color;
      span.appendChild(document.createTextNode(line));
      fragment.appendChild(span);
      br = document.createElement('br');
      fragment.appendChild(br);
    })
  })

  result.innerHTML = '';
  result.appendChild(fragment);
}
