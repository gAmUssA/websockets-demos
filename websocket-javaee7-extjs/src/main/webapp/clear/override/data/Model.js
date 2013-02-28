Ext.define('Clear.override.data.Model', {
    requires: [
       'Ext.data.Model'               
    ]
}, function () {
    Ext.data.Model.override({
        /**
         * Sets the model instance's id field to the given id.
         * Unlike standard implementation it does not change phantom setting; thus new record
         * will remain new even after id is assigned, be that via explicit programmatic `setId()` or
         * implicity, in the constructor though `genId` property (which ultimately applies `setId()` anyway).
         * This implicates that one can not use `setId(null)` to turn on the `phantom` flag
         * @param {Number/String} id The new id
         */
        setId: function(id) {
            this.set(this.idProperty, id);
            //!!! this.phantom  = !(id || id === 0);
        },
        // New method
	    computeAssociatedDirty: function() {
	    	var me = this,
        	associations = me.associations,
    		association,
    		associatedStore,
    		i,
    		count = associations.getCount(),
    		associatedDirty = false;
        	
        	for (i=0; i<count; i++) {
        		association = associations.getAt(i);        				
        		if (association.type=="hasMany") {
        			associatedStore = me[association.storeName];
        			if (associatedStore && associatedStore.commitRequired) {
        				associatedDirty = true;
        				break;
        			}
        		}        					
        	}
        	if (associatedDirty !== me.associatedDirty) {
        		me.associatedDirty = associatedDirty;
        	} 
        	return associatedDirty;
        }
    });
} );