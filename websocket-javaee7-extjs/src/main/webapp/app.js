
//@require @packageOverrides

Ext.Loader.setConfig({
    disableCaching: false,
    enabled: true,
    paths: {
        WebSocketDemo: 'app',
        Clear: 'clear'
    }
});

Ext.require([
    'Clear.ux.WebSocket',
    'Clear.ux.WebSocketManager'
]);

Ext.application({

    requires: [
        'Clear.override.ExtJSOverrider'
    ],

    controllers: ["Main"],

    name: 'WebSocketDemo',

    autoCreateViewport: true
});
