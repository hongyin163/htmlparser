var HTMLTokenizer = require('./HTMLTokenizer');
var fs = require('fs');
var content = fs.readFileSync('./content.html', 'utf-8');

var HTMLDocumentParser = require('./HTMLDocumentParser');

var parser = new HTMLDocumentParser(content);

parser.pumpTokenizerLoop();
// var tokenNizer = new HTMLTokenizer(content);
// var t = tokenNizer.nextToken();
// while (t) {
//     console.log(t);
//     t = tokenNizer.nextToken();
// }                 
// var char=' ';
// switch(char){
//     case /\s/g:
//     console.log(char);
//     break
// }