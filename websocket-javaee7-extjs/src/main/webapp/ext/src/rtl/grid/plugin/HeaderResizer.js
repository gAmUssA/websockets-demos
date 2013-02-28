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
Ext.define('Ext.rtl.grid.plugin.HeaderResizer', {
    override: 'Ext.grid.plugin.HeaderResizer',

    adjustColumnWidth: function(offsetX) {
        if (this.headerCt.isOppositeRootDirection()) {
            offsetX = -offsetX;
        }
        this.callParent([offsetX]);
    },

    adjustConstrainRegion: function(region, t, r, b, l) {
        return this.headerCt.isOppositeRootDirection() ?
            region.adjust(t, -l, b, -r) : this.callParent(arguments);
    },

    calculateDragX: function(gridSection) {
        var gridX = gridSection.getX(),
            mouseX = this.tracker.getXY('point')[0];
        
        if (this.headerCt.isOppositeRootDirection()) {
            return mouseX - gridX;    
        } else {
            return this.callParent(arguments);
        }   

    },

    getViewOffset: function(gridSection, view) {
        var headerCtRtl = this.headerCt.getHierarchyState().rtl,
            borderWidth = gridSection.el.getBorderWidth(headerCtRtl ? 'r': 'l'),
            offset = view.getX() - gridSection.getX();
            
        if (!headerCtRtl !== !Ext.rootHierarchyState.rtl) {
            offset = -(offset + view.getWidth() - gridSection.getWidth());
        }

        return offset - borderWidth;
    },
    
    getMovingMarker: function(markerOwner){
        if (this.headerCt.isOppositeRootDirection()) {
            return markerOwner.getLhsMarker();
        } else {
            return markerOwner.getRhsMarker();
        }
    },

    setMarkerX: function(marker, x) {
        var headerCt = this.headerCt;
        if (headerCt.getHierarchyState().rtl && !headerCt.isOppositeRootDirection()) {
            marker.rtlSetLocalX(x);
        } else {
            this.callParent(arguments);
        }
    }
});
