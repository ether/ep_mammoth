var mammoth = require("mammoth");
mammoth.convertToHtml({path: "/home/jose/Downloads/testydoc.doc"})
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
