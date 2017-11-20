var mammoth = require("./node_modules/mammoth");
var fs = require("fs");
var settings = require("ep_etherpad-lite/node/utils/Settings");

exports.import = function(hook_name, args, callback){
  var srcFile = args.srcFile;
  var destFile = args.destFile;

  if(!settings.ep_mammoth){
    settings.ep_mammoth = {};
  }
  if(settings.ep_mammoth.ignoreEmptyParagraphs !== false){
    settings.ep_mammoth.ignoreEmptyParagraphs = true;
  }

  var options = {
    styleMap: [
      "p[style-name='center'] => center",
      "p[style-name='right'] => right",
      "p[style-name='left'] => left",
      "p[style-name='justify'] => justify",

      "p[style-name='Heading 1'] => p:fresh > h1:fresh",
      "p[style-name='Heading 2'] => p:fresh > h2:fresh",
      "p[style-name='Heading 3'] => p:fresh > h3:fresh",
      "p[style-name='Heading 4'] => p:fresh > h4:fresh",
      "p[style-name='Heading 5'] => p:fresh > h5:fresh",
      "p[style-name='Heading 6'] => p:fresh > h6:fresh"
    ],
    transformDocument: transformElement,
    ignoreEmptyParagraphs: settings.ep_mammoth.ignoreEmptyParagraphs
  };

  // First things first do we handle this doc type?
  var docType = srcFile.split('.').pop();

  if(docType !== "docx") return callback(); // we don't support this doctype in this plugin
  var results = "";
  console.log("Using mammoth to convert DocX file");

  mammoth.convertToHtml(
  {
    path: srcFile
  }, options).then(
  function(result) {
    console.log(result.value);
//    result.value = result.value.replace("</h1>", "</h1><br>");
    fs.writeFile(destFile, "<!doctype html>\n<html lang=\'en\'>\n<body>\n"+result.value+"\n</body>\n</html>\n", 'utf8', function(err){
      if(err) callback(err, null);
      callback(destFile);
    });
  })
  .fail(function(e){
    console.warn("Mammoth failed to import this file");
    return callback();
  })
  .done(function(){
    // done
  });
}

function transformElement(element) {
  if (element.children) {
    element.children.forEach(transformElement);
  }
  if (element.type === "paragraph") {
    if (element.alignment === "center" && !element.styleId) {
      element.styleName = "center";
    }
    if (element.alignment === "left" && !element.styleId) {
      element.styleName = "left";
    }
    if (element.alignment === "right" && !element.styleId) {
      element.styleName = "right";
    }
    if (element.alignment === "justify" && !element.styleId) {
      element.styleName = "justify";
    }
  }
  return element;
}
