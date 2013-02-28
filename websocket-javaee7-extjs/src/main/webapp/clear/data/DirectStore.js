/**
 * This file is part of the Clear Components for Ext JS 4.
 * 
 * Copyright (c) 2012 Farata Systems  http://www.faratasystems.com
 *
 * Licensed under The MIT License
 * Re-distributions of files must retain the above copyright notice.
 *
 * @license http://www.opensource.org/licenses/mit-license.php The MIT License
 *
*/
/**
 * @author Victor Rasputnis
 * 
 * This class should be used in place of the standard {@link Ext.data.DirectStore} to support
 * transactional synchronization of the store data with an Ext.Direct provider supported by
 * [CDBExt](http://www.cleartoolkit.com/dokuwiki/doku.php?id=clearwiki:03.cdbextjs "CDBExt").
 * 
 * Implementation of {@link #sync} goes beyond the standard concept of batching for synchronization
 * supported by {@link Ext.data.DirectStore}. Here batch spans the store itself and entire hierarchy of child stores
 * that are associated with the records of the parent stores via *hasMany* / *belongsTo* associations.
 * 
 * First, notice the new property - {@link #commitRequired} - a boolean flag that is indicating if
 * any modifications had been done to the store data since the last load. 
 * 
 * Now we can explain what the {@link #sync} does. The store contributes up to three entries to the batch: 
 * one for all new records, one for all updated records and one for all removed records. In addition,
 * every record of the store knows is any of the associated stores are in the state where their 
 * `commitRequired` is true. If so, every modified child store will contribute up to three entries
 * to the batch and so on, recursively.
 * 
 * Execution of the sorted batch is done via {@link Clear.transaction.BatchManager}. It happens within
 * a single XMLHTTP request and either succeeds in full or is entirely rejected by the server.  
 * Upon completion of the batch, BatchManager iterates over results and applies the changes
 * to all participating stores.
 * Here is an example of the configured `Clear.data.DirectStore`:
 *     Ext.define('MyApp.store.example.CompanyStore',{
 *         extend: 'Clear.data.DirectStore',
 *         requires  : ['MyApp.model.example.CompanyModel'],
 *         model:'MyApp.model.example.CompanyModel',		
 *         api: {
 *             create:MyApp.direct.action.CompanyService.getCompanies_insertItems,
 *             read : MyApp.direct.action.CompanyService.getCompanies,
 *             update:MyApp.direct.action.CompanyService.getCompanies_updateItems,
 *             destroy:MyApp.direct.action.CompanyService.getCompanies_deleteItems
 *         }
 *     });
 */
Ext.define('Clear.data.DirectStore', {
    
    extend: 'Ext.data.Store',   
    alias: 'store.clear',
    requires: [
               'Clear.data.proxy.DirectProxy',
               'Ext.util.HashMap',
               'Ext.window.MessageBox'
              ],    
    uses: ['Clear.transaction.BatchManager'],
        
    /* Begin Definitions */
    /**
     * @property {String} batchUpdateMode
     * @removed 4.0 Not applicable for {@link Clear.data.DirectStore}
     * As per ancestor {@link Ext.data.Store} this property used to set the updating behavior based on batch synchronization.
     * The default - 'operation' - would update the Store's
     * internal representation of the data after each action of the batch has completed, 'complete' would wait until
     * the entire batch has been completed before updating the Store's data.
     * 
     * Batching in Clear Components is transactional: the entire sequence of actions (batch)  
     * *must* complete or terminate on the server in full. The batch includes actions corresponding to inserts,
     * deletes and updates done to the store as well as *child* stores, associated to the records of the
     * given store via `hasMany` associations. 
     * 
     * Accordingly, while `sync()` of {@link Ext.data.DirectStore} could send three independent requests to the server
     * under `batchUpdateMode='complete'` or multiple (one per modified record) requests - under `batchUpdateMode='operation'`,
     * the `sync()` of {@link Clear.data.DirectStore} results in only one request. When this request completes
     * all participating stores get updated.
     * 
     * In that sense legacy values of 'operation' and 'complete' are not relevant along with the
     * property `batchUpdateMode`.
     */
    batchUpdateMode: 'operation',
        
    /**
     * @property {Boolean} commitRequired
	 *  Flag denoting that records loaded into this directStore have been added, removed or modified. 
	 *  Flag is cleared to false upon successfull {@link #sync}
     */
    commitRequired: false,
    
    /**
     * @property {Ext.util.HashMap} modifiedMap
	 * Collection of modified records
	 * @private 
     */
    modifiedMap: null,
    
    /**
     * @property {Object} foreignKeyValue
	 * For a one-to-many associated store, the value of the foreign key property 
	 * @private 
     */
    foreignKeyValue: null,
    
    /**
     * @property {String} foreignKeyName
	 * For a one-to-many associated store, the name of the foreign key property 
	 * @private 
     */
    foreignKeyName: null,
    
    /* End Definitions */

    /**
     * Creates the store with the  {@link Clear.data.proxy.Direct} proxy
     * @param {Object} config (optional) Config object
     */
    
    constructor : function(config){

        // CHANGE: out-of-the-box ExtJS 4.0.7 does not account
    	// for storeConfig vs. instance config and, in particular
    	// when instantiated in MVC will not communicate
    	// "Direct" related information to the proxy

    	var defaultConfig = {};
    	Ext.copyTo(defaultConfig, this, "paramOrder,paramsAsHash,directFn,api,simpleSortMode", true);    	
    	config = config || {};
    	Ext.applyIf(config, defaultConfig);
    	
        config.api = config.api || {};     	
        
        if (!config.proxy) {
            var proxyAttributes = {
                type: 'clear'
            };
            Ext.copyTo(proxyAttributes, config, 'paramOrder,paramsAsHash,directFn,api,simpleSortMode');
            Ext.copyTo(proxyAttributes.reader, config, 'totalProperty,root,idProperty');
            // Constructor of the AbstractStore will use setProxy() to make the proxy via Ext.createByAlias()
            config.proxy = proxyAttributes;
        }
        
        this.callParent([config]); 
        this.addEvents(
                /**
                 * @event exception
                 * Fired when this batch encountered an exception
                 * @param {Ext.data.Batch} batch The batch object
                 * @param {Object} operation The operation that encountered the exception
                 */
                'exception',
                /**
                 * @event commitRequiredChange
                 * Fired when 'commitRequired' is changing the value
                 * @param {String} property  The name of the property
                 * @param {Object} newValue  New value of the property
                 * @param {Object} oldValue  Old value of the property
                 */
                'commitRequiredChange'
        );
        this.resetState();
        this.on({
        	load: 	this.onProxyLoadDebug,
        	add: 	this.onAddRecord,
        	remove: this.onRemoveRecord,
        	update: this.onUpdateRecord,
        	write:	this.updateCommitRequired,
        	read:	this.updateCommitRequired
        });
    },
    //This method is internally called by load() and removeAll()
    //private
    clearData: function(isLoad) {
        this.callParent([isLoad]);
        this.resetState();
    },
    setProxy: function(proxy) {
    	var me = this;
    	me.callParent([proxy]);
    	me.proxy.addListener('exception',me.onProxyException);
    },

    getChanges: function() {
    	  	var me        = this,
            changes   = {},
            toCreate  = me.getNewRecords(),
            toUpdate  = me.getUpdatedRecords(),
            toDestroy = me.getRemovedRecords();


        if (toCreate.length > 0) {
            changes.create = toCreate;
        }

        if (toUpdate.length > 0) {
            changes.update = toUpdate;
        }

        if (toDestroy.length > 0) {
            changes.destroy = toDestroy;
        }
        
        return changes;
    },
    
    updateCommitRequired: function() {    	 	
    	this.setCommitRequired((this.modifiedMap.getCount() + this.removed.length) > 0);
    },
    
    setCommitRequired: function(newValue) {
		if (newValue !== this.commitRequired) {
			this.commitRequired = newValue;
			this.fireEvent("commitRequiredChange", this, newValue, this.commitRequired);
		}   	
    },
    /**
     * @inheritdoc
     * options=
     * callback:onCallback(batch, options);
     * success:doSuccess(batch, options)
     * failure:doFailure(batch, options)
     * scope:scope for all/proxy
     */
    sync: function(options) {
        var me        = this,
			changes = me.getChanges(),
			batchManager;
        	//Changes based purely on the top store will carry nothing
            // event when child (associated) stores have been modified.a
        	//This is a design limitation of the beforesync event.
	        if (me.fireEvent('beforesync', changes) !== false) {
	        	batchManager = Ext.create('Clear.transaction.BatchManager');
	        	batchManager.addStore(me, 0);
	        	batchManager.createBatch();
	        	batchManager.on('complete', this.onBatchComplete, this);
	        	batchManager.on('exception', this.onBatchException, this);
	        	me.syncOptions = options || {};
	        	me.syncOptions.batchManager = batchManager;
	        	me.syncOptions.scope = me.syncOptions.scope || me;
	        	batchManager.sendBatch();
	            //JSinternal::saveState(act);
				//if (!autoSyncEnabled && !roundTripSync)
				//	resetState();
	        }        
    }, 
    
    /*
     * @private
     * Resets 'extra' state management counters and flags added by DirectStore
     * Not to be used as public method, b/c the real state is dispersed in records
     * 
     */
    resetState: function() {
        this.commitRequired = false;
        this.modifiedMap = new Ext.util.HashMap();
        //this.removed = [];// this is a redundancy, after store.onDestroyRecords()
    },

    /*
     * @private
     * Attached as the 'add' event listener
     */
    onAddRecord: function(store, items) {

	   	Ext.each(items, function(item, index, value){
	   		if(item.isValid()) {
	   			this.modifiedMap.add(item);
	   		}
	   	}, this);
		this.updateCommitRequired();
    },
    
    /**
     * @private
     * Handles 'complete' event of the sync's batchManager.
     */    
    onBatchComplete: function() {
    	var me = this,
    		success = me.syncOptions.success,
    		scope = me.syncOptions.scope; 

    	if (typeof success == 'function') {
    		success.call(scope);
    	}
    },
    
    /**
     * @private
     * Handles 'exception' event of the sync's batchManager.
     */    
    onBatchException: function(message, where) {  		
    	var me = this,
    		failure = me.syncOptions.failure,
    		scope = me.syncOptions.scope; 

    	if (typeof failure == 'function') {
    		failure.call(scope, message, where);
    	} else {    		
    		Ext.MessageBox.alert( "Batch Failed", Ext.String.format("{0}/n{1}", message, where));	
    	}
    },
    /**
     * @private
     * Attached as the 'load' event, it is executed after proxy loads as well as after non-proxy loads.
     * If there was a proxy exception it had been already reported
     */
    onProxyLoadDebug: function(store, records, successful){
    	  if (successful) {
    		  if (Ext.isDefined(Ext.global.console)) {
                  Ext.global.console.log( "onLoad", Ext.String.format("Store {0} loaded {1} records", store.storeId, records.length));
    		  }    
    	  } 
    },
    
    onProxyException: function (proxy, response, operation) {
    	var error = operation.error;
        Ext.MessageBox.alert( error.message, Ext.String.format("{0}::{1} failed: {2}", error.action, error.method, error.where));	
    	
    },
    /**
     * @private
     * Attached as the 'remove' event listener
     */
    onRemoveRecord: function (store, item) {
      var associations;

      if (item.phantom!==true) {			
	    	  if (this.modifiedMap.remove(item) ) {
				associations = item.associatons;
				associations.each(function(association) {
					var associatedStore;
					if (association.type=="hasMany") {
						associatedStore = item[association.storeName];
						if (associatedStore) {
							associatedStore.removeAll();
						} 
					}        					
				}, this);
	    	  }
	    	  // Make sure freshly added and already commited item has "raw":
	    	  if (item.raw === undefined) {
	    		  item.raw = Ext.apply({}, item.data)
	    	  }
      }
      this.updateCommitRequired();		
    },
    
    /**
     * @private
     * Attached as the 'update' event listener
     */
    onUpdateRecord: function (store, item) {
		var me=this, 
			   property;	
	    				
		// Item might have reverted to original value or be not changed at all
		// but associations can be dirty
		item.computeAssociatedDirty();
		
		if (me.modifiedMap.get(item.id)) {
			//Remove item that does not belond to modifiedMap
			if (item.isValid()) {
				if ( item.dirty!==true && item.associatedDirty!==true) {
					me.modifiedMap.remove(item);
				} 
			} else {
				me.modifiedMap.remove(item);	 
			}		
		} else {
			//Add item that belongs to the modifiedMap
			if (item.isValid()) {
				if ( item.dirty || item.associatedDirty) {
					//To allow update server with the client-based records,
					//we 'backdate' create missing 'raw':
					if (item.raw === undefined) {
						item.raw = Ext.apply({}, item[item.persistenceProperty]);
						Ext.apply(item.raw, item.modified);
					}
						
					me.modifiedMap.add(item);
				} 											
			}
		}
		this.updateCommitRequired();
    }
});
