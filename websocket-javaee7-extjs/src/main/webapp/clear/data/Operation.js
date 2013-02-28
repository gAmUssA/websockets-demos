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
 * Represents a single read or write operation performed by a {@link Ext.data.proxy.Proxy Proxy}. Operation objects are
 * used to enable communication between Stores and Proxies. Application developers should rarely need to interact with
 * Operation objects directly.
 *
 */
Ext.define('Clear.data.Operation', {
 
	extend: 'Ext.data.Operation',
	
	proxy: null,

    /**
     * This method is called to commit data to this instance's records given the records in
     * the server response. This is followed by calling {@link Ext.data.Model#commit} on all
     * those records (for 'create' and 'update' actions, skipping 'destroy' ones).
     *
     * @param {Ext.data.Model[]} changeObjects An array of {@link Clear.data.ChangeObject} objects returned by
     * the server.
     */
    commitRecords: function (changeObjects) {
        var me = this,
            mc, index, clientRecords, changeObject, clientRec, serverRec, reassignModelDefaultsRequired;

        if (!me.actionSkipSyncRe.test(me.action)) {
            clientRecords = me.records;

            if (clientRecords && clientRecords.length) {
                mc = Ext.create('Ext.util.MixedCollection', true, function(r) {return r.id;});
                mc.addAll(clientRecords);

                for (index = changeObjects ? changeObjects.length : 0; index--; ) {
                    changeObject = changeObjects[index];              
                    clientRec = mc.get(changeObject.id);
                    // Notice that now we compare by ID of the record rather then by the "id" of the data of the record
                    // This helps identify records where data id has been modified/autoincremented by the server
                    // Goind forward with PUSH we will need to add second level search by comparing the data id
                    if (clientRec) {
                        serverRec = changeObject.newVersion;
                        clientRec.beginEdit();
                        
                        reassignModelDefaultsRequired = (serverRec.getId() != clientRec.getId());

                        clientRec.set(serverRec.data);
                        clientRec.endEdit(true);

                        if (reassignModelDefaultsRequired)
                        		this.reassignModelDefaults(clientRec);
                    }
                }

                if (me.actionCommitRecordsRe.test(me.action)) {
                    for (index = clientRecords.length; index--; ) {
                        clientRecords[index].commit();
                    }
                }
            }
        }
    },
    
    
	/**
	 * Reassign model defaults for associated stores where foreignKey is out of date 
	 * @private
	 */ 
    reassignModelDefaults: function(item) {

    	var associations = item.associations;
		associations.each(function(association) {
			var associatedStore;
			if (association.type=="hasMany") {
				associatedStore = item[association.storeName]; //i.e. item['getAssociatesStore']
				if ((associatedStore) && (associatedStore.foreignKeyValue!==item.getId())) {
					associatedStore.foreignKeyValue = item.getId();
					associatedStore.modelDefaults[associatedStore.foreignKeyName] = associatedStore.foreignKeyValue;
				} 
			}        					
		}, item);	    	
    },
    
    
    /*
     * Returns an array of Ext.data.Model instances as set by the Proxy.
     * For read-action operations - that's resultSet.records;
     * for create-, update-, destroy-action  operations - that's the already modified records
     */
    /**
     * @inheritdoc
     */
    getRecords: function() {
    	var result = this.records;
    	if (this.action=="read") {
	        var resultSet = this.getResultSet();
	        if (resultSet !== undefined )
	        	result = resultSet.records;
    	} 
    	return result;
    },
 
});
