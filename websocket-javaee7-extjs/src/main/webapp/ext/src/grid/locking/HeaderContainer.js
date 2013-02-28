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
 * Private class which acts as a HeaderContainer for the Lockable which aggregates all columns
 * from both sides of the Loackable. It is never rendered, it's just used to interrogate the
 * column collection.
 */
Ext.define('Ext.grid.locking.HeaderContainer', {
    extend: 'Ext.grid.header.Container',

    constructor: function(lockable) {
        var me = this,
            events,
            event,
            eventNames = [];

        me.lockable = lockable;
        me.callParent();

        // Relay events from both sides' headerCts
        events = me.lockable.lockedGrid.headerCt.events;
        for (event in events) {
            if (events.hasOwnProperty(event)) {
                eventNames.push(event);
            }
        }
        me.relayEvents(me.lockable.lockedGrid.headerCt, eventNames);
        me.relayEvents(me.lockable.normalGrid.headerCt, eventNames);
    },

    // This is the function which all other column access methods are based upon
    // Return the full column set for the whole Lockable assembly
    getGridColumns: function(flushCache) {
        return this.lockable.lockedGrid.headerCt.getGridColumns(flushCache).concat(this.lockable.normalGrid.headerCt.getGridColumns(flushCache));
    },

    // Lockable uses its headerCt to gather column state
    getColumnsState: function () {
        var me = this,
            locked = me.lockable.lockedGrid.headerCt.getColumnsState(),
            normal = me.lockable.normalGrid.headerCt.getColumnsState();

        return locked.concat(normal);
    },

    // Lockable uses its headerCt to apply column state
    applyColumnsState: function (columns) {
        var me             = this,
            lockedGrid     = me.lockable.lockedGrid,
            lockedHeaderCt = lockedGrid.headerCt,
            normalHeaderCt = me.lockable.normalGrid.headerCt,
            lockedCols     = Ext.Array.toValueMap(lockedHeaderCt.items.items, 'headerId'),
            normalCols     = Ext.Array.toValueMap(normalHeaderCt.items.items, 'headerId'),
            locked         = [],
            normal         = [],
            lockedWidth    = 1,
            length         = columns.length,
            i, existing,
            lockedDefault,
            col;

        for (i = 0; i < length; i++) {
            col = columns[i];

            lockedDefault = lockedCols[col.id];
            existing = lockedDefault || normalCols[col.id];

            if (existing) {
                if (existing.applyColumnState) {
                    existing.applyColumnState(col);
                }
                if (existing.locked === undefined) {
                    existing.locked = !!lockedDefault;
                }
                if (existing.locked) {
                    locked.push(existing);
                    if (!existing.hidden && typeof existing.width == 'number') {
                        lockedWidth += existing.width;
                    }
                } else {
                    normal.push(existing);
                }
            }
        }

        // state and config must have the same columns (compare counts for now):
        if (locked.length + normal.length == lockedHeaderCt.items.getCount() + normalHeaderCt.items.getCount()) {
            lockedHeaderCt.removeAll(false);
            normalHeaderCt.removeAll(false);

            lockedHeaderCt.add(locked);
            normalHeaderCt.add(normal);

            lockedGrid.setWidth(lockedWidth);
        }
    }
});