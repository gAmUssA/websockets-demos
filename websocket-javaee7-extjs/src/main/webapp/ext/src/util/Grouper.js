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
 * @class Ext.util.Grouper

Represents a single grouper that can be applied to a Store. The grouper works
in the same fashion as the {@link Ext.util.Sorter}.

 * @markdown
 */
 
Ext.define('Ext.util.Grouper', {

    /* Begin Definitions */

    extend: 'Ext.util.Sorter',

    /* End Definitions */
   
   isGrouper: true,

    /**
     * Returns the value for grouping to be used.
     * @param {Ext.data.Model} instance The Model instance
     * @return {String} The group string for this model
     */
    getGroupString: function(instance) {
        return instance.get(this.property);
    }
});