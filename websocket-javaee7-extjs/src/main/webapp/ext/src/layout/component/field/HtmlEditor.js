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
 * Layout class for {@link Ext.form.field.HtmlEditor} fields. Sizes textarea and iframe elements.
 * @private
 */
Ext.define('Ext.layout.component.field.HtmlEditor', {
    extend: 'Ext.layout.component.field.FieldContainer',
    alias: ['layout.htmleditor'],

    type: 'htmleditor',
    
    naturalHeight: 150,
    naturalWidth: 300,

    beginLayout: function(ownerContext) {
        var owner = this.owner;
        this.callParent(arguments);
        
        ownerContext.toolbarContext  = ownerContext.context.getCmp(owner.toolbar);
        ownerContext.inputCmpContext = ownerContext.context.getCmp(owner.inputCmp);
        ownerContext.textAreaContext = ownerContext.getEl('textareaEl');
        ownerContext.iframeContext   = ownerContext.getEl('iframeEl');
    },
    
    beginLayoutCycle: function(ownerContext) {
        var me = this,
            widthModel = ownerContext.widthModel,
            heightModel = ownerContext.heightModel,
            owner = me.owner,
            iframeEl = owner.iframeEl,
            textareaEl = owner.textareaEl;
            
        me.callParent(arguments);
        if (widthModel.shrinkWrap) {
            iframeEl.setStyle('width', '');
            textareaEl.setStyle('width', '');
        } else if (widthModel.natural) {
            ownerContext.bodyCellContext.setWidth(me.naturalWidth);
        }
        
        if (heightModel.natural || heightModel.shrinkWrap) {
            iframeEl.setHeight(me.naturalHeight);
            textareaEl.setHeight(me.naturalHeight);
        }
    },
    
    finishedLayout: function(){
        this.callParent(arguments);
        // In IE6 quirks sometimes the element requires repainting
        // to show properly.
        if (Ext.isIE9m && Ext.isIEQuirks) {
            this.owner.el.repaint();
        }    
    },
    
    publishOwnerWidth: function(ownerContext, width){
        this.callParent(arguments);
        width -= ownerContext.inputCmpContext.getBorderInfo().width;
        ownerContext.textAreaContext.setWidth(width);
        ownerContext.iframeContext.setWidth(width);
    },
    
    // The offsets for the text area are needed for bugs in sizing with IE.
    // The main issue behind it is that the iframe requires an initial height
    // to be set while the component is auto sizing, however we need to switch
    // it when using a configured size. A more permanent solution might be to
    // have the iframe and text area be child components of the container
    // as opposed to being directly inserted into the DOM.
    publishInnerWidth: function(ownerContext, width){
        var border = ownerContext.inputCmpContext.getBorderInfo().width,
            ieBug = Ext.isStrict && Ext.isIE8m,
            natural = ownerContext.widthModel.natural;
          
        this.callParent(arguments);
        width = ownerContext.bodyCellContext.props.width - border;
        if (natural) {
            if (ieBug) {
                width -= 2;
            }
            ownerContext.textAreaContext.setWidth(width);
            ownerContext.iframeContext.setWidth(width);
        } else if (ieBug) {
            ownerContext.textAreaContext.setWidth(width);
        }
    },

    publishInnerHeight: function (ownerContext, height) {
        var toolbarHeight = ownerContext.toolbarContext.getProp('height'),
            sourceEdit = this.owner.sourceEditMode;
        
        this.callParent(arguments);
        height = ownerContext.bodyCellContext.props.height;
        
        if (toolbarHeight !== undefined) {
            height -= toolbarHeight + ownerContext.inputCmpContext.getFrameInfo().height;
            if (Ext.isIE8 && Ext.isStrict) {
                height -= 2;
            } else if (Ext.isIEQuirks && (Ext.isIE8 || Ext.isIE9)) {
                height -= 4;
            }
            ownerContext.iframeContext.setHeight(height);    
            ownerContext.textAreaContext.setHeight(height);    
        } else {
            this.done = false;
        }
    }
 
});