var mammoth = require("./node_modules/mammoth");
var fs = require("fs");

exports.import = function(hook_name, args, callback){
  var srcFile = args.srcFile;
  var destFile = args.destFile;

  var options = {
    styleMap: [
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh"
    ]
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
    fs.writeFile(destFile, "<body>"+result.value+"</body>", 'utf8', function(err){
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
