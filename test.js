var mammoth = require("mammoth");
var fs = require("fs");

var docxPath = "/home/jose/Desktop/centre.docx";
if(process.argv[2]) docxPath = process.argv[2];
console.log("Testing", docxPath);

require("mammoth/lib/docx/docx-reader").read({path: docxPath}).then(function(raw){
  console.log("Input data");
  var data = raw.value.children;
  // console.log(data);
  for (var i in data){
    console.log("Line number", i);
    var blob = data[i];
    console.log(blob);
    var children = blob.children;
    var boo = children[0];
    console.log(boo);
    console.log("==========================\n\n");
  }
});

var options = {
  styleMap: [
    "p[style-name='center'] => center",
    "p[style-name='Heading 1'] => p:fresh > h1:fresh",
    "p[style-name='Heading 2'] => p:fresh > h2:fresh",
    "p[style-name='Heading 3'] => p:fresh > h3:fresh",
    "p[style-name='Heading 4'] => p:fresh > h4:fresh",
    "p[style-name='Heading 5'] => p:fresh > h5:fresh",
    "p[style-name='Heading 6'] => p:fresh > h6:fresh"
  ],
  transformDocument: transformElement
};

mammoth.convertToHtml({path: docxPath}, options)
.then(function(result){
  var html = result.value; // The generated HTML
  var messages = result.messages; // Any messages, such as warnings during conversion
  console.log(result);
})
.fail(function(e){
  console.log("ERROR!");
})
.done(function(result){
  console.log(result);
});

function transformElement(element) {
  if (element.children) {
    element.children.forEach(transformElement);
  }
  if (element.type === "paragraph") {
    if (element.alignment === "center" && !element.styleId) {
      element.styleName = "center";
    }
  }
  return element;
}

