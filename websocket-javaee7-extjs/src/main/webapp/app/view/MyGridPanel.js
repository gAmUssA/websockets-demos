Ext.define('WebSocketDemo.view.MyGridPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mypanel',
    autoScroll: true,
    animCollapse: false,
    minWidth: 400,
    minHeight: 140,
    width: 800,
    height: 600,
    layout: {type: 'border', padding: 6},
    defaults: {
        collapsible: true,
        split: true
    },

    items: [
        {
            title: 'WebSocket Stock Grid',
            xtype: 'stockgrid',
            flex: 6,
            region: 'center'
        },
        {
            xtype: 'panel',
            flex: 4,
            region: 'south',
            title: 'Server-Sent Events Stock Grid',
            html: 'server-sent events (EventSource) demo grid',
            collapsed: true,
            collapsible: true
        }
    ],

    tbar: [
        {text: 'Open WebSocket connection', action: 'open_socket'},
        '-',
        {text: 'Close WebSocket connection', action: 'close_socket'},
        '-',
        {text: 'Http GET-request', action: 'doRestCall'},
        {
            xtype: 'textfield',
            name: 'ticker',
            width: 100,
            emptyText: 'Ticker...',
            enableKeyEvents: true,
            style: 'text-align: left'
        },
        '-',
        {text: 'Subscribe to Server-Sent Events', action: 'sse_subscribe'}
    ],
    initComponent: function(){
        
    }
});
