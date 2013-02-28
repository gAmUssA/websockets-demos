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
 * @override Ext.rtl.layout.component.Dock
 * This override adds RTL support to Ext.layout.component.Dock.
 */
Ext.define('Ext.rtl.layout.component.Dock', {
    override: 'Ext.layout.component.Dock',

    rtlPositions: {
        top: 'top',
        right: 'left',
        bottom: 'bottom',
        left: 'right'
    },

    getDockCls: function(dock) {
        // When in RTL mode it is necessary to reverse "left" and "right" css class names.
        // We have to do it this way (as opposed to using css overrides) because of the
        // !important border-width rules, e.g.:
        // .x-docked-left { border-right-width: 0 !important; }
        return 'docked-' +
            (this.owner.getHierarchyState().rtl ? this.rtlPositions[dock] : dock);
    }
});
