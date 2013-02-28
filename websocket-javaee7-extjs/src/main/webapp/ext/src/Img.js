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
 * Simple helper class for easily creating image components. This renders an image tag to
 * the DOM with the configured src.
 *
 * {@img Ext.Img/Ext.Img.png Ext.Img component}
 *
 * ## Example usage:
 *
 *     var changingImage = Ext.create('Ext.Img', {
 *         src: 'http://www.sencha.com/img/20110215-feat-html5.png',
 *         renderTo: Ext.getBody()
 *     });
 *
 *     // change the src of the image programmatically
 *     changingImage.setSrc('http://www.sencha.com/img/20110215-feat-perf.png');
 *
 * By default, only an img element is rendered and that is this component's primary
 * {@link Ext.AbstractComponent#getEl element}. If the {@link Ext.AbstractComponent#autoEl} property
 * is other than 'img' (the default), the a child img element will be added to the primary
 * element. This can be used to create a wrapper element around the img.
 *
 * ## Wrapping the img in a div:
 *
 *     var wrappedImage = Ext.create('Ext.Img', {
 *         src: 'http://www.sencha.com/img/20110215-feat-html5.png',
 *         autoEl: 'div', // wrap in a div
 *         renderTo: Ext.getBody()
 *     });
 */
Ext.define('Ext.Img', {
    extend: 'Ext.Component',
    alias: ['widget.image', 'widget.imagecomponent'],

    autoEl: 'img',

    /**
     * @cfg {String} src
     * The image src.
     */
    src: '',

    /**
     * @cfg {String} alt
     * The descriptive text for non-visual UI description.
     */
    alt: '',

    /**
     * @cfg {String} title
     * Specifies addtional information about the image.
     */
    title: '',

    /**
     * @cfg {String} imgCls
     * Optional CSS classes to add to the img element.
     */
    imgCls: '',

    getElConfig: function() {
        var me = this,
            config = me.callParent(),
            img;

        // It is sometimes helpful (like in a panel header icon) to have the img wrapped
        // by a div. If our autoEl is not 'img' then we just add an img child to the el.
        if (me.autoEl == 'img') {
            img = config;
        } else {
            config.cn = [img = {
                tag: 'img',
                id: me.id + '-img'
            }];
        }

        if (me.imgCls) {
            img.cls = (img.cls ? img.cls + ' ' : '') + me.imgCls;
        }

        img.src = me.src || Ext.BLANK_IMAGE_URL;

        if (me.alt) {
            img.alt = me.alt;
        }
        if (me.title) {
            img.title = me.title;
        }

        return config;
    },

    onRender: function () {
        var me = this,
            el;

        me.callParent(arguments);

        el = me.el;
        me.imgEl = (me.autoEl == 'img') ? el : el.getById(me.id + '-img');
    },

    onDestroy: function () {
        Ext.destroy(this.imgEl);
        this.imgEl = null;
        this.callParent();
    },

    /**
     * Updates the {@link #src} of the image.
     * @param {String} src
     */
    setSrc: function(src) {
        var me = this,
            imgEl = me.imgEl;

        me.src = src;

        if (imgEl) {
            imgEl.dom.src = src || Ext.BLANK_IMAGE_URL;
        }
    }
});