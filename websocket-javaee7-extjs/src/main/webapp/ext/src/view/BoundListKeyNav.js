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
 * A specialized {@link Ext.util.KeyNav} implementation for navigating a {@link Ext.view.BoundList} using
 * the keyboard. The up, down, pageup, pagedown, home, and end keys move the active highlight
 * through the list. The enter key invokes the selection model's select action using the highlighted item.
 */
Ext.define('Ext.view.BoundListKeyNav', {
    extend: 'Ext.util.KeyNav',
    requires: 'Ext.view.BoundList',

    /**
     * @cfg {Ext.view.BoundList} boundList (required)
     * The {@link Ext.view.BoundList} instance for which key navigation will be managed.
     */

    constructor: function(el, config) {
        var me = this;
        me.boundList = config.boundList;
        me.callParent([el, Ext.apply({}, config, me.defaultHandlers)]);
    },

    defaultHandlers: {
        up: function() {
            var me = this,
                boundList = me.boundList,
                allItems = boundList.all,
                oldItem = boundList.highlightedItem,
                oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
                newItemIdx = oldItemIdx > 0 ? oldItemIdx - 1 : allItems.getCount() - 1; //wraps around
            me.highlightAt(newItemIdx);
        },

        down: function() {
            var me = this,
                boundList = me.boundList,
                allItems = boundList.all,
                oldItem = boundList.highlightedItem,
                oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
                newItemIdx = oldItemIdx < allItems.getCount() - 1 ? oldItemIdx + 1 : 0; //wraps around
            me.highlightAt(newItemIdx);
        },

        pageup: function() {
            //TODO
        },

        pagedown: function() {
            //TODO
        },

        home: function() {
            this.highlightAt(0);
        },

        end: function() {
            var me = this;
            me.highlightAt(me.boundList.all.getCount() - 1);
        },

        enter: function(e) {
            this.selectHighlighted(e);
        }
    },

    /**
     * Highlights the item at the given index.
     * @param {Number} index
     */
    highlightAt: function(index) {
        var boundList = this.boundList,
            item = boundList.all.item(index);
        if (item) {
            item = item.dom;
            boundList.highlightItem(item);
            boundList.getTargetEl().scrollChildIntoView(item, false);
        }
    },

    /**
     * Triggers selection of the currently highlighted item according to the behavior of
     * the configured SelectionModel.
     */
    selectHighlighted: function(e) {
        var me = this,
            boundList = me.boundList,
            highlighted = boundList.highlightedItem,
            selModel = boundList.getSelectionModel();
        if (highlighted) {
            selModel.selectWithEvent(boundList.getRecord(highlighted), e);
        }
    }

});