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
 * @author Don Griffin
 *
 * This class is a sequential id generator. A simple use of this class would be like so:
 *
 *     Ext.define('MyApp.data.MyModel', {
 *         extend: 'Ext.data.Model',
 *         idgen: 'sequential'
 *     });
 *     // assign id's of 1, 2, 3, etc.
 *
 * An example of a configured generator would be:
 *
 *     Ext.define('MyApp.data.MyModel', {
 *         extend: 'Ext.data.Model',
 *         idgen: {
 *             type: 'sequential',
 *             prefix: 'ID_',
 *             seed: 1000
 *         }
 *     });
 *     // assign id's of ID_1000, ID_1001, ID_1002, etc.
 *
 */
Ext.define('Ext.data.SequentialIdGenerator', {
    extend: 'Ext.data.IdGenerator',
    alias: 'idgen.sequential',

    constructor: function() {
        var me = this;

        me.callParent(arguments);

        me.parts = [ me.prefix, ''];
    },

    /**
     * @cfg {String} prefix
     * The string to place in front of the sequential number for each generated id. The
     * default is blank.
     */
    prefix: '',

    /**
     * @cfg {Number} seed
     * The number at which to start generating sequential id's. The default is 1.
     */
    seed: 1,

    /**
     * Generates and returns the next id.
     * @return {String} The next id.
     */
    generate: function () {
        var me = this,
            parts = me.parts;

        parts[1] = me.seed++;
        return parts.join('');
    }
});
