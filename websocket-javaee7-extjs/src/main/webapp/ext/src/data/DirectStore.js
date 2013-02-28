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
 * Small helper class to create an {@link Ext.data.Store} configured with an {@link Ext.data.proxy.Direct}
 * and {@link Ext.data.reader.Json} to make interacting with an {@link Ext.direct.Manager} server-side
 * {@link Ext.direct.Provider Provider} easier. To create a different proxy/reader combination create a basic
 * {@link Ext.data.Store} configured as needed.
 *
 * **Note:** Although they are not listed, this class inherits all of the config options of:
 *
 * - **{@link Ext.data.Store Store}**
 *
 * - **{@link Ext.data.reader.Json JsonReader}**
 *
 *   - **{@link Ext.data.reader.Json#cfg-root root}**
 *   - **{@link Ext.data.reader.Json#idProperty idProperty}**
 *   - **{@link Ext.data.reader.Json#totalProperty totalProperty}**
 *
 * - **{@link Ext.data.proxy.Direct DirectProxy}**
 *
 *   - **{@link Ext.data.proxy.Direct#directFn directFn}**
 *   - **{@link Ext.data.proxy.Direct#paramOrder paramOrder}**
 *   - **{@link Ext.data.proxy.Direct#paramsAsHash paramsAsHash}**
 *
 */
Ext.define('Ext.data.DirectStore', {
    /* Begin Definitions */
    
    extend: 'Ext.data.Store',
    
    alias: 'store.direct',
    
    requires: ['Ext.data.proxy.Direct'],
   
    /* End Definitions */

    constructor : function(config){
        config = Ext.apply({}, config);
        if (!config.proxy) {
            var proxy = {
                type: 'direct',
                reader: {
                    type: 'json'
                }
            };
            Ext.copyTo(proxy, config, 'paramOrder,paramsAsHash,directFn,api,simpleSortMode');
            Ext.copyTo(proxy.reader, config, 'totalProperty,root,idProperty');
            config.proxy = proxy;
        }
        this.callParent([config]);
    }    
});
