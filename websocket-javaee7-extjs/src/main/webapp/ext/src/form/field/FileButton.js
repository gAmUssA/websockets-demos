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
 *
 */
Ext.define('Ext.form.field.FileButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.filebutton',
    
    childEls: [
        'btnEl', 'btnWrap', 'btnInnerEl', 'btnIconEl', 'fileInputEl'
    ],
    
    inputCls: Ext.baseCSSPrefix + 'form-file-input',
    
    cls: Ext.baseCSSPrefix + 'form-file-btn',
    
    preventDefault: false,

    renderTpl: [
        '<div id="{id}-btnWrap" class="{baseCls}-wrap',
            '<tpl if="splitCls"> {splitCls}</tpl>',
            '{childElCls}">',
            '<a id="{id}-btnEl" class="{baseCls}-button" role="button" >',
                '<span id="{id}-btnInnerEl" class="{baseCls}-inner {innerCls}',
                    '{childElCls}">',
                    '{text}',
                '</span>',
                '<span id="{id}-btnIconEl" class="{baseCls}-icon-el {iconCls}',
                    '{childElCls}"',
                    '<tpl if="iconUrl"> style="background-image:url({iconUrl})"</tpl>>',
                '</span>',
            '</a>',
        '</div>',
        '<input id="{id}-fileInputEl" class="{inputCls}" type="file" size="1" name="{inputName}">'
    ],
    
    getTemplateArgs: function(){
        var args = this.callParent();
        args.inputCls = this.inputCls;
        args.inputName = this.inputName;
        return args;
    },
    
    afterRender: function(){
        var me = this;
        me.callParent(arguments);
        me.fileInputEl.on('change', me.fireChange, me);    
    },
    
    fireChange: function(e){
        this.fireEvent('change', this, e, this.fileInputEl.dom.value);
    },
    
    /**
     * @private
     * Creates the file input element. It is inserted into the trigger button component, made
     * invisible, and floated on top of the button's other content so that it will receive the
     * button's clicks.
     */
    createFileInput : function(isTemporary) {
        var me = this;
        me.fileInputEl = me.el.createChild({
            name: me.inputName,
            id: !isTemporary ? me.id + '-fileInputEl' : undefined,
            cls: me.inputCls,
            tag: 'input',
            type: 'file',
            size: 1
        });
        me.fileInputEl.on('change', me.fireChange, me);  
    },
    
    reset: function(remove){
        if (remove) {
            this.fileInputEl.remove();
        }
        this.createFileInput(!remove);
    },
    
    restoreInput: function(el){
        this.fileInputEl.remove();
        el = Ext.get(el);
        this.el.appendChild(el);
        this.fileInputEl = el;
    },
    
    onDisable: function(){
        this.callParent();
        this.fileInputEl.dom.disabled = true;
    },

    onEnable : function() {
        this.callParent();
        this.fileInputEl.dom.disabled = false;
    }
});
