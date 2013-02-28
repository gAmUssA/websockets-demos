Ext.define('Clear.override.data.association.HasMany', {
    requires: [
       'Ext.data.association.HasMany'  
    ]
}, function () {
	// Here we patch the createStore() method of the HasMany
	// because we need the nested stores to be of clear.data.DirectStore type
   
    Ext.data.association.HasMany.override({
	    createStore:function() {
		        var that            = this,
	            associatedModel = that.associatedModel,
	            storeName       = that.storeName,
	            foreignKey      = that.foreignKey,
	            primaryKey      = that.primaryKey,
	            filterProperty  = that.filterProperty,
	            autoLoad        = that.autoLoad,
	            storeConfig     = that.storeConfig || {},
	            storeClassName	= that.storeType || 'Clear.data.DirectStore';
	        // CHANGED: introduced parameter explicitPrimaryKey. This is used in store onUpdate
	        // to refresh the content of associated store(s) once the primaryKey has changed    
	        return function() {
	            var me = this,
	                config, filter,
	                modelDefaults = {},
	                params={},
	                onCommitRequiredChange,
	                associatedStore = me[storeName];
	      	    
	            if (associatedStore === undefined) {
	                if (filterProperty) {
	                    filter = {
	                        property  : filterProperty,
	                        value     : me.get(filterProperty),
	                        exactMatch: true
	                    };
	                    params[filterProperty] = me.get(filterProperty);
	                } else {
	                    filter = {
	                        property  : foreignKey,
	                        value     : me.get(primaryKey),
	                        exactMatch: true
	                    };
	                    //params[foreignKey] = me.get(primaryKey);
	                    //CHANGED from params[foreignKey] to params[0]. In case
	                    //or Java and Direct we pass ordered parameters 0,1,2 and
	                    //we dynamically compute the number of this parameters 
	                    //from the provider information. Here we just have one parameter - foreign key
	                    params[0] = me.get(primaryKey);
	                }
	                
	                modelDefaults[foreignKey] = me.get(primaryKey);
	                
	                config = Ext.apply({}, storeConfig, {
	                    model        : associatedModel,
	                    filters      : [filter],
	                    remoteFilter : false,
	                    modelDefaults: modelDefaults
	                });
	       
	              
	                // CHANGE: allowed to pass the storeClassName, instead of the Ext.data.Store	                
	                me[storeName] = associatedStore = Ext.create(storeClassName, config);
	                me[storeName].foreignKeyValue = params[0];
	                me[storeName].foreignKeyName = foreignKey;
	                // CHANGE: if the associate store is a descendant of the Clear.direct.Store
	                //         it will dispatch event commitRequiredChange every time it's 
	                //         commitRequired flag is changed. We used it to mark the associated
	                //         parent record as _dirtyThroughAssociation_ 
	                
		            onCommitRequiredChange = function(store, newCommitRequired, oldCommitRequired) {
	    					//this - record. This will cause 'update' event on the joined store
	    					this.afterCommit();
	    				};
	    				
	    			associatedStore.on('commitRequiredChange', onCommitRequiredChange, me);
		    			//CHANGE: load only for non-phantom rows
		            if (autoLoad && !me.phantom) {
		                //CHANGE: Added passing params for loading
		                	//CHANGE: On load completion injected parent record reference in each item 
		                	//        of the associated store, following naming expectations of the
		                	//
		                	//        belongsTo getter.
		                    me[storeName].load(
		                    		{
		                    			'params':params,
				                    	callback: function(records, operation, success) {
				                    		if (success) Ext.Array.forEach(records, function(record) {
				                    			record[Ext.getClassName(me) + 'BelongsToInstance'] = me;
				                    		});
				                    	}
		                    		}
		                    	);
		            }
	            } //if (associatedStore === undefined) 
	            	            	
		        return me[storeName];
	        }; //return function()
	    } //createStore
    }); //override

} );