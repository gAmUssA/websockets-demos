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
 * Private utility class for Ext.layout.container.Border.
 * @private
 */
Ext.define('Ext.resizer.BorderSplitter', {
    extend: 'Ext.resizer.Splitter',

    uses: ['Ext.resizer.BorderSplitterTracker'],

    alias: 'widget.bordersplitter',

    // must be configured in by the border layout:
    collapseTarget: null,

    getTrackerConfig: function () {
        var trackerConfig = this.callParent();

        trackerConfig.xclass = 'Ext.resizer.BorderSplitterTracker';

        return trackerConfig;
    }
});
