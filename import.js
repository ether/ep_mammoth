var mammoth = require("./node_modules/mammoth");
var fs = require("fs");

exports.import = function(hook_name, args, callback){
  var srcFile = args.srcFile;
  var destFile = args.destFile;

  // First things first do we handle this doc type?
  var docType = srcFile.split('.').pop();

  if(docType !== "docx") return callback(); // we don't support this doctype in this plugin
  var results = "";
  console.log("Using mammoth to convert DocX file");

  mammoth.convertToHtml(
  {
    path: srcFile
  }).then(
  function(result) {
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
