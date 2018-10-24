var fs = require('fs');
var HTMLToken = require('./HTMLToken');
var HTMLConstructionSite = require('./HTMLConstructionSite');


function HTMLTreeBuilder() {
    this.tree = new HTMLConstructionSite();
    this.tree.onEnd = function (root) {
        debugger;
        fs.writeFileSync('./tree.json',JSON.stringify(root))
        debugger;
    }
}
HTMLTreeBuilder.prototype = {
    constructTree: function (token) {
        this.processToken(token);
    },
    processToken: function (token) {
        if (token.type == HTMLToken.StartTag) {
            var attrs = token.attributes;
            var props = { children: [] };
            attrs.forEach(function (element) {
                props[element.name] = element.value;
            }, this);
            var node = {
                $$typeof: token.name,
                type: token.name,
                props: props,
                _owner: null
            };
            this.tree.push(node);
        } else if (token.type == HTMLToken.Character) {
            this.tree.push({
                $$typeof: token.name,
                type: token.name,
                props: { children: token.data },
                _owner: null
            });
            this.tree.pop();
        }
        else if (token.type == HTMLToken.EndTag) {
            this.tree.pop();
        }
        console.log(token);
    }
}
module.exports = HTMLTreeBuilder;