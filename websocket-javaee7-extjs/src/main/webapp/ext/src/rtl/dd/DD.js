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
Ext.define('Ext.rtl.dd.DD', {
    override: 'Ext.dd.DD',

    // used be alignElWithMouse to get the local x coordinate adjusted for rtl mode if
    // the page-level coordinate system is rtl.
    getLocalX: function(el) {
        return Ext.rootHierarchyState.rtl ? el.rtlGetLocalX() : el.getLocalX();
    },

    // setLocalXY is used by alignElWithMouse to avoid the overhead that would be incurred
    // by using setXY to calculate left/right/top styles from page coordinates.  Since the
    // coordinates that go into the calculation are page-level, we need to use rtl local
    // coordinates if the page-level coordinate system is rtl.
    setLocalXY: function(el, x, y) {
        Ext.rootHierarchyState.rtl ? el.rtlSetLocalXY(x, y) : el.setLocalXY(x, y);
    }
});