var mammoth = require("./node_modules/mammoth");
var fs = require("fs");

exports.import = function(hook_name, args, callback){
  var srcFile = args.srcFile;
  var destFile = args.destFile;

  // First things first do we handle this doc type?
  var docType = srcFile.split('.').pop();

  console.log("docType", docType);
  if(docType !== "docx") return callback(); // we don't support this doctype in this plugin
  var results = "";
  console.log("Using mammoth to convert DocX file");

  mammoth.convertToHtml(
  {
    path: srcFile
  }).then(
  function(result) {
    result.value = "<html><body>Erro</body></html>";
    fs.writeFile(destFile, result.value, 'utf8', function(err){
      if(err) callback(err, null);
      console.log("wrote to", destFile);
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
