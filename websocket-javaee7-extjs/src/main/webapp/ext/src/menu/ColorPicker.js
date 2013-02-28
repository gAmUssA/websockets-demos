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
 * A menu containing a Ext.picker.Color Component.
 *
 * Notes:
 *
 *   - Although not listed here, the **constructor** for this class accepts all of the
 *     configuration options of {@link Ext.picker.Color}.
 *   - If subclassing ColorMenu, any configuration options for the ColorPicker must be
 *     applied to the **initialConfig** property of the ColorMenu. Applying
 *     {@link Ext.picker.Color ColorPicker} configuration settings to `this` will **not**
 *     affect the ColorPicker's configuration.
 *
 * Example:
 *
 *     @example
 *     var colorPicker = Ext.create('Ext.menu.ColorPicker', {
 *         value: '000000'
 *     });
 *
 *     Ext.create('Ext.menu.Menu', {
 *         width: 100,
 *         height: 90,
 *         floating: false,  // usually you want this set to True (default)
 *         renderTo: Ext.getBody(),  // usually rendered by it's containing component
 *         items: [{
 *             text: 'choose a color',
 *             menu: colorPicker
 *         },{
 *             iconCls: 'add16',
 *             text: 'icon item'
 *         },{
 *             text: 'regular item'
 *         }]
 *     });
 */
 Ext.define('Ext.menu.ColorPicker', {
     extend: 'Ext.menu.Menu',

     alias: 'widget.colormenu',

     requires: [
        'Ext.picker.Color'
     ],

    /**
     * @cfg {Boolean} hideOnClick
     * False to continue showing the menu after a color is selected.
     */
    hideOnClick : true,

    /**
     * @cfg {String} pickerId
     * An id to assign to the underlying color picker.
     */
    pickerId : null,

    /**
     * @cfg {Number} maxHeight
     * @private
     */

    /**
     * @property {Ext.picker.Color} picker
     * The {@link Ext.picker.Color} instance for this ColorMenu
     */

    /**
     * @event click
     * @private
     */

    initComponent : function(){
        var me = this,
            cfg = Ext.apply({}, me.initialConfig);

        // Ensure we don't get duplicate listeners
        delete cfg.listeners;
        Ext.apply(me, {
            plain: true,
            showSeparator: false,
            items: Ext.applyIf({
                cls: Ext.baseCSSPrefix + 'menu-color-item',
                id: me.pickerId,
                xtype: 'colorpicker'
            }, cfg)
        });

        me.callParent(arguments);

        me.picker = me.down('colorpicker');

        /**
         * @event select
         * @inheritdoc Ext.picker.Color#select
         */
        me.relayEvents(me.picker, ['select']);

        if (me.hideOnClick) {
            me.on('select', me.hidePickerOnSelect, me);
        }
    },

    /**
     * Hides picker on select if hideOnClick is true
     * @private
     */
    hidePickerOnSelect: function() {
        Ext.menu.Manager.hideAll();
    }
 });