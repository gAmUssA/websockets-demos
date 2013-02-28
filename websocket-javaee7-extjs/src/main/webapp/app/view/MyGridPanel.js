Ext.define('WebSocketDemo.view.MyGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mypanel',
    autoScroll: true,
    store: 'StockStore',
    plugins: [
        /*{ptype: 'cellediting'}*/
    ],

    columns: [
        {
            header: 'id',
            dataIndex: 'id',
            flex: 1
        },
        {
            header: 'price',
            dataIndex: 'price',
            flex: 1/*,
            editor: {xtype: 'textfield'}*/

        },
        {
            header: 'symbol',
            dataIndex: 'symbol'/*,
            flex: 1, editor: {xtype: 'textfield'}*/

        }
    ],

    tbar: [
        {text: 'Open', action: 'open_socket'},
        {text: 'Close', action: 'close_socket'}
    ]
});
