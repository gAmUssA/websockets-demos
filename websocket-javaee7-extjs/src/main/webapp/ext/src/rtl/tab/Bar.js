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
Ext.define('Ext.rtl.tab.Bar', {
    override: 'Ext.tab.Bar',
    adjustTabPositions: function() {
        var items = this.items.items,
            i = items.length,
            tab;

        if (!this.getHierarchyState().rtl) {
            return this.callParent();
        }

        // When tabs are rotated vertically we don't have a reliable way to position
        // them using CSS in modern browsers.  This is because of the way transform-orign
        // works - it requires the width to be known, and the width is not known in css.
        // Consequently we have to make an adjustment to the tab's position in these browsers.
        // This is similar to what we do in Ext.panel.Header#adjustTitlePosition
        if (!Ext.isIE9m) {
            if (this.dock === 'left') {
                // rotated 90 degrees around using the top left corner as the axis.
                // tabs need to be shifted to the right by their height
                while (i--) {
                    tab = items[i];
                    tab.el.setStyle('right', -tab.lastBox.height + 'px');
                }
            } else if (this.dock === 'right') {
                // rotated 270 degrees around using the top right corner as the axis.
                // tabs need to be shifted to the left by their width
                while (i--) {
                    tab = items[i];
                    tab.el.setStyle('right', tab.lastBox.width + 'px');
                }
            }
        }
    }
})


