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
Ext.define('Ext.tree.ViewDragZone', {
    extend: 'Ext.view.DragZone',

    isPreventDrag: function(e, record) {
        return (record.get('allowDrag') === false) || !!e.getTarget(this.view.expanderSelector);
    },

    getDragText: function() {
        var records = this.dragData.records,
            count = records.length,
            text = records[0].get(this.displayField),
            suffix = 's';
            
        if (count === 1 && text) {
            return text;    
        } else if (!text) {
            suffix = '';
        }
        return Ext.String.format(this.dragText, count, suffix);
    },

    afterRepair: function() {
        var me = this,
            view = me.view,
            selectedRowCls = view.selectedItemCls,
            records = me.dragData.records,
            r,
            rLen    = records.length,
            fly = Ext.fly,
            item;

        if (Ext.enableFx && me.repairHighlight) {
            // Roll through all records and highlight all the ones we attempted to drag.
            for (r = 0; r < rLen; r++) {
                // anonymous fns below, don't hoist up unless below is wrapped in
                // a self-executing function passing in item.
                item = view.getNode(records[r]);

                // We must remove the selected row class before animating, because
                // the selected row class declares !important on its background-color.
                fly(item.firstChild).highlight(me.repairHighlightColor, {
                    listeners: {
                        beforeanimate: function() {
                            if (view.isSelected(item)) {
                                fly(item).removeCls(selectedRowCls);
                            }
                        },
                        afteranimate: function() {
                            if (view.isSelected(item)) {
                                fly(item).addCls(selectedRowCls);
                            }
                        }
                    }
                });
            }

        }
        me.dragging = false;
    }
});