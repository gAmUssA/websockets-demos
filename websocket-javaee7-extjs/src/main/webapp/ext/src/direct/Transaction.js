/*
This file is part of Ext JS 4.2

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

Pre-release code in the Ext repository is intended for development purposes only and will
not always be stable. 

Use of pre-release code is permitted with your application at your own risk under standard
Ext license terms. Public redistribution is prohibited.

For early licensing, please contact us at licensing@sencha.com

Build date: 2013-02-13 19:36:35 (686c47f8f04c589246d9f000f87d2d6392c82af5)
*/
/**
 * Supporting Class for Ext.Direct (not intended to be used directly).
 */
Ext.define('Ext.direct.Transaction', {
    alias: 'direct.transaction',
    alternateClassName: 'Ext.Direct.Transaction',
   
    statics: {
        TRANSACTION_ID: 0
    },
    
    /**
     * @cfg {Ext.direct.Provider} provider Provider to use with this Transaction.
     */
   
    /**
     * Creates new Transaction.
     * @param {Object} [config] Config object.
     */
    constructor: function(config) {
        var me = this;
        
        Ext.apply(me, config);

        me.id = me.tid = ++me.self.TRANSACTION_ID;
        me.retryCount = 0;
    },
   
    send: function() {
        var me = this;
        
        me.provider.queueTransaction(me);
    },

    retry: function() {
        var me = this;
        
        me.retryCount++;
        me.send();
    },

    getProvider: function() {
        return this.provider;
    }
});
