/**
 * @class Clear.ux.EventSource
 * @author Viktor Gamov <viktor.gamov@faratasystems.com>
 *
 *     Wrapper for HTML5 EventSource
 */
Ext.define('Clear.ux.EventSource', {
    alias: 'widget.eventsource',

    mixins: {
        observable: 'Ext.util.Observable'
    },

    config: {
        /**
         * @cfg {String} url The Url to connect
         */
        url: ''
    },
    constructor: function (cfg) {
        var me = this;

        me.initConfig(cfg);
        me.mixins.observable.constructor.call(me, cfg);

        me.addEvents(
            'open',
            'error',
            'message',
            'close'
        );

        try {
            me.eventsource = new EventSource(me.url);

            me.eventsource.onmessage = function (event) {
                //me.eventsource.onmessage = Ext.bind(me.receiveTextMessage, this);
                me.fireEvent('message', me, event);
            };

            me.eventsource.onopen = function (event) {
                me.fireEvent('open', me);
            };

            me.eventsource.onerror = function (event) {
                me.fireEvent('error', me);
            };

        }
        catch (err) {
            Ext.Error.raise(err);
            return null;
        }
        return me;
    },
    receiveTextMessage: function (message) {
        var me = this;

        try {
            // Message event is always sent
            me.fireEvent('message', me, message);
        }
        catch (err) {
            Ext.Error.raise(err);
        }
    },
    close: function(){
        this.eventsource.close();
    }
});