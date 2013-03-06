Ext.define('WebSocketDemo.view.StockGrid', {
    extend: 'Ext.grid.Panel',
    store: 'StockStore',
    alias: 'widget.stockgrid',
    viewConfig: {
        markDirty: false
    },
    columns: [
        {
            header: 'symbol',
            dataIndex: 'symbol',
            flex: 2 /*editor: {xtype: 'textfield'}*/
        },
        {
            header: 'Open Price',
            dataIndex: 'price',
            flex: 1
            /*editor: {xtype: 'textfield'}*/
        },
        {
            header: 'Last Price',
            dataIndex: 'change',
            flex: 1,
            renderer: function change(val) {
                if (val > 0) {
                    return '<span style="color:green;">' + val + '</span>';
                } else if (val < 0) {
                    return '<span style="color:red;">' + val + '</span>';
                }
                return val;
            }
            /*editor: {xtype: 'textfield'}*/
        }
    ],

    tbar: [
        {text: 'Open WebSocket connection', action: 'open_socket'},'-',
        {text: 'Close WebSocket connection', action: 'close_socket'},'-',
        {text: 'Http GET-request', action: 'doGet'},
        {
            xtype: 'textfield',
            width: 100,
            emptyText: 'Ticker...',
            enableKeyEvents: true,
            style: 'text-align: left'
        },'-',
        {text: 'Subscribe to Server-Sent Events', action: 'sse_subscribe'}
    ]
});