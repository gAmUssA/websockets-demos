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
 * Facilitates transactional {@link Clear.data.DirectStore#sync sync()} for one or more *top-level* stores and, recursively, their children.
 * 
 * The batch arranged by this object consists of {@link Clear.transaction.BatchMember} elements - up
 * to three per a store - representing inserts, deletes and updates accumulated by one or more stores that developer
 * adds directly, via {@link #addStore addStore()}.
 * 
 * BatchManager walks, recursively, down the hierarchy of the modified child stores associated via 'hasMany' association and
 * adds their {@link Clear.transaction.BatchMember} elements as well. The resulting batch is sorted
 * so that a member carrying 'inserts' on the parent store is always listed before the ones with 'inserts' of the children.
 * Likewise, a member of the batch carrying 'deletes' of the parent store is always listed after all 'deletes' of the children.
 * 
 * Execution of the sorted batch is done on the server by a class implementing the `clear.transaction.IBatchGateway` interface:
 *     package clear.transaction;
 *     import java.util.List;
 *     public interface IBatchGateway {
 *        List<BatchMember> execute(List<BatchMember> items);
 *     }
 *
 * The batch is execute transactionally: either entire batch is commited to persistent storage
 * or it is rolled back entirely. 
 * 
 * Upon completion of the batch, BatchManager iterates over results and applies them to all participating stores.
 *
 */
Ext.define('Clear.transaction.BatchManager', {
    mixins: {
        observable: 'Ext.util.Observable'
    },
    uses: [
    	'Clear.transaction.BatchMember',
    	'Clear.data.ChangeObject',
    	'Clear.data.Operation'
    ],

    /**
     * Creates new Batch object.
     * @param {Object} [config] Config object
     */
    constructor: function(config) {
        var me = this;

        me.addEvents(
          /**
           * @event complete
           * Fired when this batch have been completed
           */
          'complete',

          /**
           * @event exception
           * Fired when this batch encountered an exception
           * @param {String} message. Error message
           * @param {String} where. Error stack trace
           * 
           */
          'exception'
        );

        me.mixins.observable.constructor.call(me, config);


        /*
         * Ordered array of store/priority pairs
         */
        me.registry = [];
        me.internalRegistry = [];
        me.batch = [];
        me.storeMap = null;
        me.stateMap = null;
        me.operations = null;
    },

	/**
	 * Register store for later batch creation
	 * @param {Clear.data.DirectStore} store. 
	 * In the process of registration this store is considered as
	 * a *top-level* store, emphasizing that other stores, associated via 'hasMany'
	 * to the records of the *top-level*, will also be registered for batch creation as long as these
	 * stores have been modified.
	 * @param {Number} priority
	 * The 
	 */
    addStore: function(store, priority) {
    	var registry = this.registry;
		registry.push({'store':store, 'priority':priority});
    },
	/**
	 * Creates the batch from all pre-registered stores 
	 * @return batch 
	 */
    createBatch: function () {
		var me=this,
			i,
		    batchMember,
		    records,
		    changeObjects = [],
		    store,
		    registry = me.registry,
		    _registry = me.internalRegistry = [];

		me.batch = [];
		me.operations = [];
		
		for ( i = registry.length-1; i>=0; i-- ) {
			me.registerWithChildren(registry[i]);
		}
		Ext.Array.sort(_registry, this.sortOnPriority);
		
		for ( i=_registry.length-1; i>=0; i-- ) {
			store = _registry[i].store;
			//store.dispatchEvent(new DataCollectionEvent(DataCollectionEvent.COLLECTING_CHANGES));	
		}	
		
		for ( i=_registry.length-1; i>=0; i-- ) {
			store = _registry[i].store;
			records = store.getRemovedRecords();
			if (records.length > 0) {
				changeObjects = [];
				Ext.each(records, function(record) {	        						
					changeObjects.push(
						Ext.create('Clear.data.ChangeObject', 
							{	
								id: record.id,
								changedPropertyNames:[],
								newVersion: null,
								previousVersion: record.raw,
								state: 3
							}
						) 
				);	        	    			
				});				
				batchMember = Ext.create('Clear.transaction.BatchMember', {
					className: me.getDirectAction(store, 'destroy'),
					methodName: me.getDirectMethod(store, 'destroy'),
					parameters:[changeObjects],
					autoSyncSubtopic:Ext.isEmpty(store.autoSyncSubtopic)?store.proxy.readParamString:store.autoSyncSubtopic
				});
				me.batch.push(batchMember);
		    	me.operations.push(
		    		Ext.create('Clear.data.Operation', {
	                    action: 'destroy',
	                    'records': records,
	                    proxy: store
		    		})    
                );			
			}
		}
		for (i=0; i< _registry.length; i++ ) {
			store = _registry[i].store;
			records = store.getUpdatedRecords();
			if (records.length > 0) {
				changeObjects = [];
				Ext.each(records, function(record) {	    
	        		changeObjects.push(
	        			Ext.create('Clear.data.ChangeObject', 
	        				{	
    	        				id: record.id,
        	    				changedPropertyNames:Ext.Object.getKeys(record.modified),
    	    		    		newVersion: record.data,
        	    				previousVersion: record.raw,
        	    				state: 2
    		        	    }
	        			) 
		    		);	
				});


				batchMember = Ext.create('Clear.transaction.BatchMember', {
					className: me.getDirectAction(store, 'update'),
					methodName: me.getDirectMethod(store, 'update'),
					parameters:[changeObjects],
					autoSyncSubtopic:Ext.isEmpty(store.autoSyncSubtopic)?store.proxy.readParamString:store.autoSyncSubtopic
				});
				me.batch.push(batchMember);
		    	me.operations.push(
		    		Ext.create('Clear.data.Operation', {
	                    action: 'update',
	                    'records': records,
	                    proxy: store
		    		})    
	            );	
			}
		}
		
		for (i=0; i< _registry.length; i++ ) {
			store = _registry[i].store;
			records = store.getNewRecords();
			if (records.length > 0) {
				changeObjects = [];
				Ext.each(records, function(record) {	    
	        		changeObjects.push(
	        			Ext.create('Clear.data.ChangeObject', 
	        				{	
            					id: record.id,	        			
        	    				changedPropertyNames:Ext.Object.getKeys(record.modified),
    	    		    		newVersion: record.data,
        	    				previousVersion: null,
        	    				state: 1
    		        	    }
	        			) 
	        	);		
				});	    
				batchMember = Ext.create('Clear.transaction.BatchMember', {
					className: me.getDirectAction(store, 'create'),
					methodName: me.getDirectMethod(store, 'create'),
					parameters:[changeObjects],
					autoSyncSubtopic:Ext.isEmpty(store.autoSyncSubtopic)?store.proxy.readParamString:store.autoSyncSubtopic
				});
				me.batch.push(batchMember);
		    	me.operations.push(
		    		Ext.create('Clear.data.Operation', {
	                    action: 'create',
	                    'records': records,
	                    proxy: store
		    		})    
		        );
		    }
		}
		return me.batch;
	},
	/**
	 * Sends the batch for execution by a `IBatchGateway` implementation
	 */
	sendBatch: function(batch)/*:AsyncToken*/ {
		var me = this,
		    key,
		    store,
		    storeMap = me.storeMap = Ext.create("Ext.util.HashMap"),
	//		stateMap = me.stateMap = Ext.create("Ext.util.HashMap"),
		    i,
			_registry = me.internalRegistry;
		    batchGatewayCallback = me.prepareBatchGatewayCallback(),
		    batch = batch || this.batch;
		
		if( _registry) {
			for (i=0; i< _registry.length; i++ ) {
				store = _registry[i].store;
				key =  this.getStoreKey(store);
				storeMap.add(key, store);
//				var token:AsyncToken = new AsyncToken(new RemotingMessage());
//				token.method = DataCollection.SYNC;
				// If datacollection is not going to clean it's state with returned or pushed changeObjects,
				// we clear in in advance. If problem happens, we will restoreState()
//				dataCollection.JSinternal::saveState(token);	
//				if (!dataCollection.autoSyncEnabled && !dataCollection.roundTripSync)
//					dataCollection.resetState();

//				stateMap[key] = token;
			}
		}
		
		Clear.direct.action.BatchGateway.execute(batch, batchGatewayCallback);
	},
	
	/**
	 * @private
	 * Returns class name of the direct action
	 */ 
	getDirectAction: function(store, actionType) {
		var action = store.proxy.getDirectAction(actionType);
		if (!action) 
			action = store.proxy.getDirectAction('read');
		return action;
	},
	
	/**
	 * @private
	 * Returns method name of the direct action
	 */ 
	getDirectMethod: function(store, actionType) {
		var method = store.proxy.getDirectMethod(actionType),
			suffix = '';
		if (!method) {
			method = store.proxy.getDirectMethod('read');
			switch (actionType) {
				case 'destroy': suffix = "_deleteItems"; break; 
				case 'update': suffix = "_updateItems"; break; 
				case 'create': suffix = "_insertItems"; break; 
			}
			method = method + suffix;
		}
		return method;
	},
	/**
	 * @private
	 */
	getStoreKey: function(store) {
		return this.getDirectAction(store, 'read') + "." +
			this.getDirectMethod(store, 'read') + "."  + 
    		store.proxy.readParamString;
	},    
	/**
	 * @private
	 */
	ignoreSubmethod: function (methodName) {
		var t = methodName.split(/_deleteItems|_insertItems|_updateItems/);
		return t[0];
	},
	/**
	 * @private
	 * Prepares callback that will know 'this' as the closure's "me", 
	 * given the global window scope of the callback itself
	 */
	prepareBatchGatewayCallback: function() {
		var me = this;
		return function (result, remotingEvent) {
			if (remotingEvent.status)
				me.onComplete(result);
			else
				me.onException(remotingEvent.message, remotingEvent.where);
		};	 	
	},
	/**
	 * Handles successful completion of the batch
	 * @private
	 */
	onComplete: function (result) {
		 var me = this,
		 	 batchMember,	 
		 	 key, proxy,response, store;

		 for (var i=0; i< result.length; i++ ) {
			 batchMember = Ext.create("Clear.transaction.BatchMember", result[i]);
			 key = batchMember.className + "." + me.ignoreSubmethod(batchMember.methodName) + "." +  batchMember.autoSyncSubtopic;
		     store = me.storeMap.get(key);
		     if (store) {			    	 
		    	response = Ext.create('Ext.direct.RemotingEvent', {
		    		status: true,
		    		action:batchMember.className,
		    		method:batchMember.methodName,
		    		result:batchMember.result
		    	}); 
		    	proxy = store.getProxy();
		    	proxy.processResponse(true, me.operations[i], null, response, Ext.emptyFn, me);
		    	store.onProxyWrite(me.operations[i]);	       
		    	/*
		    	 The original code does this: 
		    	 me.suspendEvents();
		    	 me.onProxyWrite(me.operations[i]);
		    	 me.resumeEvents();		       
			     me.fireEvent('datachanged', me);
			     me.fireEvent('refresh', me);
		         This results in loosing 'write' from onProxyWrite(), which fires all 3 events.
		         In turn, when we loose 'write' we loose recal of commitRequired 
		        */
			 } else {
				 if (Ext.isDefined(Ext.global.console)) {
	                  Ext.global.console.log("Missing store for key: " + key);
				 }     
			 }			
		}
		me.fireEvent('complete'); 
	 		
	},
	/**
	 * Handles failure of the batch
	 * @private
	 */
	onException: function (message, where) {
		this.fireEvent('exception', message, where); 
	},
	/**
	 * Used to sort batch members in the order of priority
	 * @private
	 */     
    sortByPriority: function(a, b) {
		if (a.priority > b.priority) {
			return 1;
		} else if (a.priority < b.priority) {
			return -1;
		} else  {
			// == 
			return 0;
		}
    },
	/**
	 * @private
	 */
    registerWithChildren: function(registration) {
		var me = this,
			internalRegistry = me.internalRegistry,
			childRanking=[],
			modifiedItems, 
			removedItems,
			store = registration.store;
		
	//if (store.syncRequired) {
		internalRegistry.push(registration);
		
		// Add to registry all modified children
		modifiedItems = store.modifiedMap.getValues();
		Ext.Array.forEach(modifiedItems, function(item) {
			if (item.associatedDirty) {
				var associations = item.associations;
				var count = associations.getCount();
				for (var i=0; i<count; i++) {
					var association = associations.getAt(i);
					var associatedStore;
					if (association.type=="hasMany") {
						associatedStore = item[association.storeName];
						if (associatedStore) {							
							//			childRanking =  item.childRanking; // that was array for all associations					
							me.registerWithChildren({
								'store': associatedStore, 
								'priority': registration.priority * 100 //+ childRanking[i] 
							});
						}
					}				
				}
			}
		});
		
		// Children collections of deleted hierarchical items get cascade-removeAll, so
		// they need to be added to registry too
		removedItems = store.getRemovedRecords();
		Ext.Array.forEach(removedItems,function(item){	
	
			var associations = item.associations;
			var count = associations.getCount();
			for (var i=0; i<count; i++) {
				var association = associations.getAt(i);
				var associatedStore;
				if (association.type=="hasMany") {
					associatedStore = item[association.storeName];
					if (associatedStore) {						
						me.registerWithChildren({
							'store': associatedStore, 
							'priority': registration.priority + 1 
						});
					}
				}
			}				
		}, this);
	//}		
    }
  
});
