
var HTMLToken = require('./HTMLToken');

var _STATE = keyMirror({
    Start: null,
    End: null,
    TokenEnd: null,
    TagNameState: null,
    TagOpenState: null,
    EndTagOpenState: null,
    DataState: null,
    BeforeAttributeNameState: null,
    BeforeAttributeValueState:null,
    AfterAttributeNameState: null,
    AttributeNameState: null,
    AttributeValueDoubleQuotedState:null,
    AfterAttributeValueQuotedState:null
});

function HTMLTokenizer(content) {
    this.token = new HTMLToken();
    this.index = 0;
    this.content = content;
    this.state = _STATE.Start;
}

function keyMirror(keys) {
    var obj = {};
    for (var key in keys) {
        obj[key] = key;
    }
    return obj;
}



HTMLTokenizer.prototype = {
    isWhitespace: function (char) {
        return /\s/.test(char)
    },
    nextInput: function () {
        if (this.index < this.content.length) {
            return this.content[this.index++];
        }
        return HTMLToken.EndOfFile;
    },
    revertIndex: function () {
        return this.index--;
    },
    match: function () {

    },
    TagOpenState: function () {
        var me = this;
        var character = me.nextInput();
        if (character == '/') {
            me.state = _STATE.EndTagOpenState;
            // return me.EndTagOpenState();
            return;
        }
        if (character == HTMLToken.EndOfFile) {
            me.state = _STATE.End;
            return;
        }

        if (!me.isWhitespace(character)) {
            me.token.beginStartTag(character);
            me.state = _STATE.TagNameState;
            return;
        }

    },
    BeforeAttributeNameState: function () {
        var me = this;
        var character = me.nextInput();
        if (me.isWhitespace(character)) {
            return;
        }
        if (character == '/') { }
        if (character == '>') {
            me.state = _STATE.TokenEnd;
            return true;
        }
        if (character == HTMLToken.EndOfFile) {
            me.state = _STATE.End;
            return;
        }
        me.token.beginAttribute(character);
        me.state = _STATE.AttributeNameState;
        // return me.AttributeNameState();
    },
    AttributeNameState: function () {
        var me = this;
        var character = me.nextInput();
        if (me.isWhitespace(character)) {
            me.state = _STATE.AfterAttributeNameState;
            return;
        }

        if (character == '=') {
            me.state = _STATE.BeforeAttributeValueState;
            return;
        }
        if (character == '>') {
            me.state = _STATE.TokenEnd;
            return true;
        }
        me.token.appendToAttributeName(character);
        return;
    },
    AfterAttributeNameState: function () {
        var me = this;
        var character = me.nextInput();
        if (me.isWhitespace(character)) {
            me.state = _STATE.AfterAttributeNameState;
            return;
        }
        if (character == '>') {
            me.state = _STATE.TokenEnd;
            return true;
        }
        if (character == '=') {
            me.state = _STATE.BeforeAttributeValueState;
            return;
        }

        me.token.beginAttribute(character);
        return;
    },
    BeforeAttributeValueState: function () {
        var me = this;
        var character = me.nextInput();
        if (me.isWhitespace(character)) {
            me.state = _STATE.BeforeAttributeValueState;
            // return me.BeforeAttributeValueState();
            return;
        }
        if (character == '"') {
            me.state = _STATE.AttributeValueDoubleQuotedState;
            return
        }
    },
    AttributeValueDoubleQuotedState: function () {
        var me = this;
        var character = me.nextInput();
        if (character == '"') {
            me.token.endAttribute(character);
            me.state = _STATE.AfterAttributeValueQuotedState;
            return;
        }
        me.token.appendToAttributeValue(character);
        return;
    },
    AfterAttributeValueQuotedState: function () {
        var me = this;
        var character = me.nextInput();
        if (character == '>') {
            me.state = _STATE.TokenEnd;
            return true;
        }
        if (me.isWhitespace(character)) {
            me.state = _STATE.BeforeAttributeNameState;
            return;
        }
        me.state = _STATE.BeforeAttributeNameState;
    },
    TagNameState: function () {
        var me = this;
        var character = me.nextInput();
        if (character == '/') {
            me.state = _STATE.SelfColseTagState;
            return;
        }
        if (character == '>') {
            me.state=_STATE.TokenEnd;
            return true;
        }

        if (!me.isWhitespace(character)) {
            me.token.appendName(character);
            me.state = _STATE.TagNameState;
            return;
        } else {
            me.state = _STATE.BeforeAttributeNameState;
            return;
        }

    },
    EndTagOpenState: function () {
        var me = this;
        var character = me.nextInput();
        if (character == '>') {
            me.state = _STATE.TokenEnd;
            return true;
        }

        if (character == HTMLToken.EndOfFile) {
            me.state = _STATE.End;
            return;
        }

        if (!me.isWhitespace(character)) {
            me.token.beginEndTag(character);
            me.state = _STATE.TagNameState;
            return;
        }
    },
    DataState: function () {
        var me = this;
        var character = me.nextInput();
        if (character == "<") {
            me.revertIndex();
            me.state = _STATE.TokenEnd;
            return true;
        }
        me.token.appendToCharacter(character);
        me.state = _STATE.DataState;
        return;
    },
    consume: function () {
        var me = this;
        var character = me.nextInput();
        if (character == HTMLToken.EndOfFile) {
            return false;
        }
        if (me.isWhitespace(character)) {
            me.consume();
        }
        if (character == '<') {
            return me.TagOpenState();
        }
    },
    Start: function () {
        var me = this;
        var character = me.nextInput();

        while (me.isWhitespace(character)) {
            character = me.nextInput();
        }
        if (character == HTMLToken.EndOfFile) {
            me.state = _STATE.End;
            return;
        }
        if (character == "<") {
            me.state = _STATE.TagOpenState;
            return;
        }
        me.token.appendToCharacter(character);
        me.state = _STATE.DataState;
    },
    processToken: function () {
        var me = this;
        me.state = _STATE.Start;

        while (true) {
            switch (me.state) {
                case _STATE.Start:
                    me.Start();
                    break;
                case _STATE.End:
                    return false;
                    break;
                case _STATE.TokenEnd:
                    return true;
                    break;
                case _STATE.TagOpenState:
                    me.TagOpenState();
                    break;
                case _STATE.TagNameState:
                    me.TagNameState();
                    break;
                case _STATE.EndTagOpenState:
                    me.EndTagOpenState();
                    break;
                case _STATE.BeforeAttributeNameState:
                    me.BeforeAttributeNameState();
                    break;
                case _STATE.AttributeNameState:
                    me.AttributeNameState();
                    break;
                case _STATE.BeforeAttributeValueState:
                    me.BeforeAttributeValueState();
                    break;
                case _STATE.AttributeValueDoubleQuotedState:
                    me.AttributeValueDoubleQuotedState();
                    break;
                case _STATE.AfterAttributeValueQuotedState:
                    me.AfterAttributeValueQuotedState();
                    break;
                case _STATE.BeforeAttributeNameState:
                    me.BeforeAttributeNameState();
                    break;
                case _STATE.DataState:
                    me.DataState();
                    break;
            }
        }
    },
    nextToken: function () {
        var me = this;
        if (me.processToken()) {
            return me.token.getToken();
        } else {
            return null;
        }
    }
}

module.exports = HTMLTokenizer;

