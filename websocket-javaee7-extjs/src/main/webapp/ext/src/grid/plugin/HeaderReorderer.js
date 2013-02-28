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
Ext.define('Ext.grid.plugin.HeaderReorderer', {
    extend: 'Ext.AbstractPlugin',
    requires: ['Ext.grid.header.DragZone', 'Ext.grid.header.DropZone'],
    alias: 'plugin.gridheaderreorderer',

    init: function(headerCt) {
        this.headerCt = headerCt;
        headerCt.on({
            render: this.onHeaderCtRender,
            single: true,
            scope: this
        });
    },

    /**
     * @private
     * AbstractComponent calls destroy on all its plugins at destroy time.
     */
    destroy: function() {
        Ext.destroy(this.dragZone, this.dropZone);
    },

    onHeaderCtRender: function() {
        var me = this;
        
        me.dragZone = new Ext.grid.header.DragZone(me.headerCt);
        me.dropZone = new Ext.grid.header.DropZone(me.headerCt);
        if (me.disabled) {
            me.dragZone.disable();
        }
    },
    
    enable: function() {
        this.disabled = false;
        if (this.dragZone) {
            this.dragZone.enable();
        }
    },
    
    disable: function() {
        this.disabled = true;
        if (this.dragZone) {
            this.dragZone.disable();
        }
    }
});
