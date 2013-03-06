Ext.define('WebSocketDemo.model.StockModel', {
    extend: 'Ext.data.Model',
    requires: [
        //'Ext.data.Types'
    ],
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'price',
            type: 'float',
            useNull: true
        },
        {
            name: 'change',
            type: 'float',
            useNull: true
        },
        {
            name: 'symbol',
            type: 'string',
            useNull: true
        }
    ]
});

//