Ext.define('Clear.override.grid.header.Container', {
    requires: [
       'Ext.grid.header.Container'          
    ]
}, function () {
	// BUGFIX: 4.0.7. assumes that storeOwner exists. However, it can be null.
	Ext.grid.header.Container.override({
		afterRender: function() {
			var storeOwner,
				sorters,
				first,
				hd;
	        this.callParent();
	        storeOwner = this.up('[store]');
	        if (storeOwner && storeOwner.store) {
	        	sorters = storeOwner.store.sorters;
	        	first   = sorters.first();
	        	
	        	if (first) {
	        		hd = this.down('gridcolumn[dataIndex=' + first.property  +']');
	        		if (hd) {
	        			hd.setSortState(first.direction, false, true);
	        		}
	        	}
	        }
	    }
	});
} );


