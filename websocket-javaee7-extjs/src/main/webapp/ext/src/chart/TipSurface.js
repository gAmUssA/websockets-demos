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
 * @private
 */
Ext.define('Ext.chart.TipSurface', {

    /* Begin Definitions */

    extend: 'Ext.draw.Component',

    /* End Definitions */

    spriteArray: false,
    renderFirst: true,

    constructor: function(config) {
        this.callParent([config]);
        if (config.sprites) {
            this.spriteArray = [].concat(config.sprites);
            delete config.sprites;
        }
    },

    onRender: function() {
        var me = this,
            i = 0,
            l = 0,
            sp,
            sprites;
            this.callParent(arguments);
        sprites = me.spriteArray;
        if (me.renderFirst && sprites) {
            me.renderFirst = false;
            for (l = sprites.length; i < l; i++) {
                sp = me.surface.add(sprites[i]);
                sp.setAttributes({
                    hidden: false
                },
                true);
            }
        }
    }
});
