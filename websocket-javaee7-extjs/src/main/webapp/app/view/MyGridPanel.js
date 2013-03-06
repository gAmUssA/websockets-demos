Ext.define('WebSocketDemo.view.MyGridPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mypanel',
    autoScroll: true,
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
            html: 'south panel'
        }
    ]
});
