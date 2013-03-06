Ext.define('WebSocketDemo.controller.Main', {
    extend: 'Ext.app.Controller',
    stores: [
        'StockStore'
    ],
    refs: [
        {
            ref: 'TheMyPanel',
            selector: 'mypanel'
        },
        {
            ref: 'stockGrid',
            selector: 'stockgrid'
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
        Ext.ux.WebSocketManager.register(ws);
    },
    onMessage: function (data) {
        //console.log("data: " + data);
        // TODO fix override issue
        var myStore = this.getStockStore();
        var a = Ext.JSON.decode(data);

        if (Object.prototype.toString.call(a) === '[object Array]') {
            myStore.loadRawData(a, false);
            return;
        }

        var record = myStore.createModel(a);

        var index = myStore.findBy(function (record, index) {
            return record.get("symbol") === a.symbol;
        });

        if (index !== -1) {
            var diff = (myStore.getAt(index).get('price')) - (record.get('price'));
            record.set('change', parseFloat(diff).toFixed(4));
        }

        myStore.removeAt(index);
        myStore.add(record);
        var row = this.getStockGrid().getView().getNode(index);
        //this.getStockGrid().getView().select(index);

        var select = Ext.get(row).select('td');
        select.highlight("3892d3", {
            attr: "backgroundColor",
            easing: 'easeOut',
            duration: 500
        });


    },
    onCloseClick: function (data) {
        console.log("closing connection...");
        Ext.ux.WebSocketManager.closeAll();
    }
});