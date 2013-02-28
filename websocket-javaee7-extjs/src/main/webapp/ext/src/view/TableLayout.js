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
 *  Component layout for {@link Ext.view.Table}
 *  @private
 * 
 */
Ext.define('Ext.view.TableLayout', {
    extend: 'Ext.layout.component.Auto',
    requires: ['Ext.util.CSS'],

    alias: ['layout.tableview'],
    type: 'tableview',

    beginLayout: function(ownerContext) {
        var me = this,
            otherSide = me.owner.lockingPartner,
            owner = me.owner;

        me.callParent(arguments);
        
        // If we are in a twinned grid (locked view) then set up bidirectional links with the other side's layout context
        if (otherSide) {
            me.lockedGrid = me.owner.up('[lockable]');
            me.lockedGrid.needsRowHeightSync = true;
            if (!ownerContext.lockingPartner) {
                ownerContext.lockingPartner = ownerContext.context.getItem(otherSide, otherSide.el);
                if (ownerContext.lockingPartner && !ownerContext.lockingPartner.lockingPartner) {
                    ownerContext.lockingPartner.lockingPartner = ownerContext;
                }
            }
        }

        // Grab a ContextItem for the header container
        ownerContext.headerContext = ownerContext.context.getCmp(me.headerCt);

        // Grab ContextItem for the table only if there is a table to size
        if (me.owner.body.dom) {
            ownerContext.bodyContext = ownerContext.getEl(me.owner.body);
        }
        if (Ext.isWebKit) {
            owner.el.select(owner.getBodySelector()).setStyle('table-layout', 'auto');
        }
    },

    calculate: function(ownerContext) {
        var me = this,
            lockingPartner = me.lockingPartner,
            contentHeight;

        // We can only complete our work (setting the CSS rules governing column widths) if the
        // Grid's HeaderContainer's ColumnLayout has set the widths of its columns.
        if (ownerContext.headerContext.hasProp('columnWidthsDone')) {
            me.setColumnWidths(ownerContext);
            ownerContext.state.columnWidthsSynced = true;
            if (ownerContext.bodyContext) {
                ownerContext.bodyContext.setHeight(contentHeight = ownerContext.bodyContext.el.dom.offsetHeight, false);
                ownerContext.setProp('contentHeight', contentHeight);
            }
            
            // If we are part of a twinned table view set (locking grid)
            // Then only complete when both sides are complete.
            if (lockingPartner && !lockingPartner.state.columnWidthsSynced) {
                me.done = false;
            } else {
                me.callParent(arguments);
            }

        } else {
            me.done = false;
        }
    },

    measureContentHeight: function(ownerContext) {
        var lockingPartner = ownerContext.lockingPartner;

        // Only able to produce a valid contentHeight if there's no table
        // ... or we have flushed all column widths to the table (or both tables if we are a pair)
        if (!ownerContext.bodyContext || (ownerContext.state.columnWidthsSynced && (!lockingPartner || lockingPartner.state.columnWidthsSynced))) {
            return this.callParent(arguments);
        }
    },

    setColumnWidths: function(ownerContext) {
        var me = this,
            owner = me.owner,
            context = ownerContext.context,
            columns = me.headerCt.getGridColumns(),
            column,
            i = 0, len = columns.length,
            tableWidth = 0,
            colWidth;

        // So that the setProp can trigger this layout.
        if (context) {
            context.currentLayout = me;
        }

        // Set column width corresponding to each header
        for (i = 0; i < len; i++) {
            column = columns[i];
            // Ensure hidden columns are zero width, and visible column widths are correct
            if (column.hidden || column.hiddenAncestor) {
                colWidth = 0;
            } else {
                colWidth = context.getCmp(column).props.width;
            }

            // Select column sizing <col> elements within every <table> within the grid.
            // 90% of the time, there will be only one table.
            // The RowWrap and Summary Features embed tables within colspanning cells, and these also
            // get <colgroup><col></colgroup> sizers ehich need updating.
            // On IE8, sizing <col> elements to control column width was about 2.25 times
            // faster than selecting all the cells in the column to be resized.
            // Column sizing using dynamic CSS rules is *extremely* expensive on IE.
            owner.body.select(owner.getColumnSizerSelector(column)).setWidth(colWidth);

            tableWidth += colWidth;
        }
        // Set widths of all tables (includes tables embedded in RowWrap and Summary rows)
        owner.el.select(owner.getBodySelector()).setWidth(tableWidth);
    },

    finishedLayout: function() {
        var me = this,
            owner = me.owner;

        me.callParent(arguments);

        if (Ext.isWebKit) {
            owner.el.select(owner.getBodySelector()).setStyle('table-layout', '');
        }
        // Make sure only one side gets to do the sync on completion - it's an expensive process.
        // Only do it if the syncRowHeightConfig hasn't been set to false.
        if (me.lockedGrid && me.lockedGrid.syncRowHeight && me.lockedGrid.needsRowHeightSync) {
            me.lockedGrid.syncRowHeights();
            me.lockedGrid.needsRowHeightSync = false;
        }
    }
});