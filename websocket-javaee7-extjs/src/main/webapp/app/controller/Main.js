Ext.define('WebSocketDemo.controller.Main', {
    extend: 'Ext.app.Controller',
    stores: [
        'StockStore'
    ],
    refs: [
        {
            ref: 'TheMyPanel',
            selector: 'mypanel'
        }
    ],
    init: function () {
        this.control(
            {
                'mypanel button[action=open_socket]': {
                    click: this.onOpenConnection
                },
                'mypanel button[action=close_socket]': {
                    click: this.onCloseClick
                }
            }
        );
    },

    onOpenConnection: function (btn) {
        var url = "ws://localhost:8080/websocket_demo/stock-generator";
        var controller = this;
        var ws = Ext.create('Ext.ux.WebSocket', {
            url: url,
            listeners: {
                open: function (ws) {
                    console.log("WebSocket just open!");
                },
                message: function (ws, data) {
                    controller.onMessage(data);
                },
                close: function (ws) {
                }
            }
        });
        Ext.ux.WebSocketManager.register (ws);
    },
    onMessage: function (data) {
        console.log("data: " + data);
        var myStore = this.getStockStore();
        var a = Ext.JSON.decode(data);
        //delete a.id;
        var record = myStore.createModel(a);
        //record.set({'symbol': a.symbol, 'price': a.price});
        myStore.add(record);

        /*var store = this.getStore('WebSocketDemo.store.StockStore');
        var modelInst = store.createModel({symbol:"MSFT",price:"8.670652407001079",id:1023332});

        store.add(modelInst);*/
    },
    onCloseClick: function(data){
        console.log("closing connection...");
        Ext.ux.WebSocketManager.closeAll();
    }
});