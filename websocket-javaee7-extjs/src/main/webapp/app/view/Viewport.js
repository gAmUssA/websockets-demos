Ext.define('WebSocketDemo.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'WebSocketDemo.view.MyGridPanel',
        'WebSocketDemo.view.StockGrid'
    ],
    border: false,
    initComponent: function (config) {

        this.layout = {
            type: 'vbox',
            align: 'stretch'
        };
        this.items = [
            {
                xtype: 'mypanel',
                flex: 5
            }
        ];
        this.callParent(arguments);
    }
});