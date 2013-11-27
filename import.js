var mammoth = require("./node_modules/mammoth");
var fs = require("fs");

exports.import = function(hook_name, args, callback){
  var srcFile = args.srcFile;
  var destFile = args.destFile;

  // First things first do we handle this doc type?
  var docType = srcFile.split('.').pop();

  // console.log("docType", docType);
  if(docType !== "docx" && docType !== "doc") return callback(); // we don't support this doctype in this plugin
  var results = "";

  mammoth.convertToHtml(
  {
    path: srcFile
  }).then(
  function(result) {
 // result.value
  result.value = "<html><body>Erro</body></html>";
    fs.writeFile(destFile, result.value, 'utf8', function(err){
      if(err) callback(err, null);
      console.log("wrote to", destFile);
      callback(destFile);
    });
  }).done(function(){
    // done
  });
}
