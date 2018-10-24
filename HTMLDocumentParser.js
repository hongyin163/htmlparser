var HTMLTokenizer = require('./HTMLTokenizer');
var HTMLTreeBuilder = require('./HTMLTreeBuilder');

function HTMLDocumentParser(content) {
    this.tokenNizer = new HTMLTokenizer(content);
    this.treeBuilder = new HTMLTreeBuilder();
}
HTMLDocumentParser.prototype = {
    constructTreeFromHTMLToken: function (token) {
        this.treeBuilder.constructTree(token);
    },
    pumpTokenizerLoop: function () {
        var me = this;
        do {
            var token = me.tokenNizer.nextToken();
            if(!token){
                return false;
            }
            console.log(token);
            me.constructTreeFromHTMLToken(token);
        } while (true)
    }
}

module.exports = HTMLDocumentParser;