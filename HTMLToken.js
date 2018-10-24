
//字符流=》token流

function HTMLToken() {
    this.name = '';
    this.type = '';
    this.data = '';
    this.attributes = [];
    this.attributeName = '';
    this.attributeValue = '';
}

HTMLToken.Uninitialized= 'Uninitialized';
HTMLToken.Doctype= 'Doctype';
HTMLToken.StartTag= 'StartTag';
HTMLToken.EndTag= 'EndTag';
HTMLToken.Character= 'Character';
HTMLToken.EndOfFile= 'EndOfFile';

HTMLToken.prototype = {
    type: function () {
        return this.type;
    },
    appendName: function (char) {
        this.name += char;
    },
    beginStartTag: function (char) {
        this.clear();
        this.type = HTMLToken.StartTag;
        this.name = char;
    },
    beginEndTag: function (char) {
        this.clear();
        this.type = HTMLToken.EndTag;
        this.name = char;
    },
    beginAttribute: function (char) {
        this.attributeName = char;
        this.attributeValue = '';
    },
    endAttribute: function (char) {
        this.attributes.push({
            name: this.attributeName,
            value: this.attributeValue
        });
        this.attributeValue = '';
        this.attributeName = '';
    },
    appendToAttributeName: function (char) {
        this.attributeName += char;
    },
    appendToAttributeValue: function (char) {
        this.attributeValue += char;
    },
    appendToCharacter: function (char) {
        this.type = HTMLToken.Character;
        this.data += char;
    },
    clear: function () {
        this.name = '';
        this.data = '';
        this.attributes = [];
        this.type = HTMLToken.Uninitialized;
    },
    getToken: function () {
        var me = this;
        var token = {
            type: me.type,
            name: me.name,
            data: me.data,
            attributes: me.attributes
        };
        me.clear();
        return token;
    }
}


module.exports = HTMLToken;