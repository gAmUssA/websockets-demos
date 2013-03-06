Ext.define('WebSocketDemo.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'WebSocketDemo.view.MyGridPanel',
        'WebSocketDemo.view.StockGrid'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'mypanel',
            flex: 5
        }
    ]
});