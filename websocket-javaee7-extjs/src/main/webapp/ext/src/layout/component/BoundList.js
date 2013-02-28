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
 * Component layout for {@link Ext.view.BoundList}.
 * @private
 */
Ext.define('Ext.layout.component.BoundList', {
    extend: 'Ext.layout.component.Auto',
    alias: 'layout.boundlist',

    type: 'component',
    
    beginLayout: function(ownerContext) {
        var me = this,
            owner = me.owner,
            toolbar = owner.pagingToolbar;

        me.callParent(arguments);
        
        if (owner.floating) {
            ownerContext.savedXY = owner.getXY();
            // move way offscreen to prevent any constraining
            // only move on the y axis to avoid triggering a horizontal scrollbar in rtl mode
            owner.setXY([0, -9999]);
        }
        
        if (toolbar) {
            ownerContext.toolbarContext = ownerContext.context.getCmp(toolbar);
        }
        ownerContext.listContext = ownerContext.getEl('listEl');
    },
    
    beginLayoutCycle: function(ownerContext){
        var owner = this.owner;
        
        this.callParent(arguments);
        if (ownerContext.heightModel.auto) {
            // Set the el/listEl to be autoHeight since they may have been previously sized
            // by another layout process. If the el was at maxHeight first, the listEl will
            // always size to the maxHeight regardless of the content.
            owner.el.setHeight('auto');
            owner.listEl.setHeight('auto');
        }
    },

    getLayoutItems: function() {
        var toolbar = this.owner.pagingToolbar;
        return toolbar ? [toolbar] : [];
    },
    
    isValidParent: function() {
        // this only ever gets called with the toolbar, since it's rendered inside we
        // know the parent is always valid
        return true;
    },

    finishedLayout: function(ownerContext) {
        var xy = ownerContext.savedXY;
        
        this.callParent(arguments);
        if (xy) {
            this.owner.setXY(xy);
        }
    },
    
    measureContentWidth: function(ownerContext) {
        return this.owner.listEl.getWidth();
    },
    
    measureContentHeight: function(ownerContext) {
        return this.owner.listEl.getHeight();
    },
    
    publishInnerHeight: function(ownerContext, height) {
        var toolbar = ownerContext.toolbarContext,
            toolbarHeight = 0;
            
        if (toolbar) {
            toolbarHeight = toolbar.getProp('height');
        }
        
        if (toolbarHeight === undefined) {
            this.done = false;
        } else {
            ownerContext.listContext.setHeight(height - ownerContext.getFrameInfo().height - toolbarHeight);
        }
    },
    
    calculateOwnerHeightFromContentHeight: function(ownerContext){
        var height = this.callParent(arguments),
            toolbar = ownerContext.toolbarContext;
            
        if (toolbar) {
            height += toolbar.getProp('height');
        }
        return height;
    }
});