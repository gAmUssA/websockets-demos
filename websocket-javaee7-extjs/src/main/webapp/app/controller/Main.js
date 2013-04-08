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
        },
        {
            ref: 'mySseGrid',
            selector: 'myssegrid'
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
                },
                'mypanel button[action=doRestCall]': {
                    click: this.onRestCall
                },
                'mypanel button[action=sse_subscribe]': {
                    click: this.onSseSubscribe
                },
                'mypanel button[action=sse_unsubscribe]': {
                    click: this.onSseUnSubscribe
                }
            }
        );
    },

    onOpenConnection: function (btn) {
        var ws_url = "ws://" + document.location.host + document.location.pathname + "stock-generator";
        var controller = this;
        var ws = Ext.create('Clear.ux.WebSocket', {
            url: ws_url,
            listeners: {
                open: function (ws) {
                    console.log("WebSocket has been opened!");
                },
                message: function (ws, data) {
                    controller.onMessage(data);
                },
                close: function (ws) {
                }
            }
        });
        Clear.ux.WebSocketManager.register(ws);
    },

    onSseSubscribe: function (btn) {
        var sse_url = "http://" + document.location.host + document.location.pathname + "rest/stock/stock-generator";
        var controller = this;
        controller.sse = Ext.create('Clear.ux.EventSource', {
            url: sse_url,
            listeners: {
                open: function (sse) {
                    console.log("EventSource has been opened");
                },
                message: function (sse, event) {
                    controller.onSseMessage(event);
                },
                error: function (sse) {
                }
            }
        });
    },

    onSseMessage: function (event) {
        //console.log('Received unnamed event: ' + event.data);
        var query = Ext.ComponentQuery.query('stockgrid')[1];
        var sseStore = query.getStore();
        var index = this.handleUpdate(event.data, sseStore);

        /*if (index) {
         var row = query.getView().getNode(index);
         //this.getStockGrid().getView().select(index);

         var select = Ext.get(row).select('td');
         select.highlight("FCEBAD", {
         attr: "backgroundColor",
         easing: 'easeOut',
         duration: 500
         });
         }*/
    },

    handleUpdate: function (data, myStore) {
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
        return index;
    },

    onMessage: function (data) {
        //console.log("data: " + data);
        var myStore = this.getStockStore();
        var index = this.handleUpdate(data, myStore);
        /*if (index) {
         var row = this.getStockGrid().getView().getNode(index);
         //this.getStockGrid().getView().select(index);

         var select = Ext.get(row).select('td');
         select.highlight("3892d3", {
         attr: "backgroundColor",
         easing: 'easeOut',
         duration: 500
         });
         }*/
    },

    onCloseClick: function (data) {
        console.log("Closing WebSocket Connection...");
        Clear.ux.WebSocketManager.closeAll();
    },
    onSseUnSubscribe: function (btn) {
        console.log("Closing EventSource connection...");
        if (this.sse.close){
            this.sse.close();
        }
    },
    onRestCall: function (btn) {
        var ticker = Ext.ComponentQuery.query('mypanel textfield[name=ticker]')[0].getValue();
        var rest_url = "http://" + document.location.host + document.location.pathname + "rest/stock/";
        if (ticker) {
            rest_url = rest_url + ticker;
            console.log("Calling http for " + ticker);
        } else {
            console.log("Calling http for random quote");
        }

        Ext.Ajax.request({
            url: rest_url,
            scope: this,
            success: function (response) {
                var a = Ext.JSON.decode(response.responseText);
                a.price = parseFloat(a.price).toFixed(4);
                console.log(a);
            }
        });
    }
});