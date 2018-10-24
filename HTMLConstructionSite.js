// var Node = {
//     $$typeof: '',
//     type: '',
//     props: {
//         children: [],
//     },
//     key: '',
//     ref: '',
//     _owner: owner
// }


function HTMLConstructionSite() {
    this.root = {
        $$typeof: 'root',
        type: 'root',
        props: {
            children: [],
        },
        key: 'root',
        _owner: null
    };
    this.current = this.root;
    this.nodes = [this.root];
    this.onEnd = function () {
        console.log('end');
    }
}


HTMLConstructionSite.prototype = {
    push: function (node) {
        var me = this;
        // node._owner = me.current;
        me.nodes.push(me.current);
        me.current.props.children.push(node);
        me.current = node;
    },
    pop: function () {
        var me = this;
        me.current = me.nodes.pop();
        
        if (me.current === me.root) {
            me.onEnd(me.current);
        }
    }
}

module.exports = HTMLConstructionSite;