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
 * A set of overrides required by the presence of the BufferedRenderer plugin.
 * 
 * These overrides of Ext.view.Table take into account the affect of a buffered renderer and
 * divert execution from the default course where necessary.
 */
Ext.define('Ext.grid.plugin.BufferedRendererTableView', {
    override: 'Ext.view.Table',

    // Listener function for the Store's add event
    onAdd: function(store, records, index) {
        var bufferedRenderer = this.bufferedRenderer,
            rows = this.all;

        // The newly added records will put us over the buffered view size, so we cannot just add as normal.
        if (bufferedRenderer && (rows.getCount() + records.length) > bufferedRenderer.viewSize) {

            // Index puts the new row(s) in the visible area, then we have to refresh the view
            if (index < rows.startIndex + bufferedRenderer.viewSize && (index + records.length) > rows.startIndex) {
                this.onDataRefresh();
            }
            // New rows outside of visible area, just ensure that the scroll range is updated
            else {
                bufferedRenderer.stretchView(this, bufferedRenderer.getScrollHeight());
            }
        }
        // No BufferedRenderer present
        // or
        // View has not yet reached the viewSize: we can add as normal.
        else {
            this.callParent([store, records, index]);
        }
    },

    // Listener function for the Store's bulkremove event
    onRemove: function(store, records, indices) {
        var bufferedRenderer = this.bufferedRenderer;

        // The view has the full complement of rows that the BufferedRenderer needs - must refresh
        if (bufferedRenderer && this.all.getCount() >= bufferedRenderer.viewSize) {
            this.onDataRefresh();
        }
        // No BufferedRenderer present
        // or
        // View has not yet reached the viewSize: we can add as normal.
        else {
            this.callParent([store, records, indices]);
        }
    }
});
