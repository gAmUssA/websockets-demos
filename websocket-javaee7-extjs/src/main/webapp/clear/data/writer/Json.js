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
 * Subclass of {@link Ext.data.writer.Json Ext.data.writer.Json} that is used by
 * {@link Clear.data.DirectProxy Clear.data.DirectProxy} to communicate to server
 * {@link Clear.data.ChangeObject ChangeObject} structures instead of plain model
 * records as part of the 'create', 'update' and 'destroy' {@link Clear.data.Operation operations}.
 * Normally, this class would not be used directly.
 */
Ext.define('Clear.data.writer.Json', {
	 extend: 'Ext.data.writer.Json',
	 alternateClassName: 'Clear.data.JsonWriter',
	 alias: 'writer.clear',
     allowSingle:false,

	 /**
	     * Prepares a Proxy's Ext.data.Request object
	     * @param {Ext.data.Request} request The request object
	     * @return {Ext.data.Request} The modified request object
	     */
	    write: function(request) {
	        var operation = request.operation,
	            records   = operation.records || [],
	            len       = records.length,
	            i         = 0,
	            data      = [];

	        for (; i < len; i++) {
	        	// Here we add one more parameter - action, to help form ChangeObject
	            data.push(this.getRecordData(records[i], operation.action));
	        }
	        return this.writeRecords(request, data);
	    },

	    /**
	     * Prepares ChangeObject to be sent to the server. This method should be overridden to format the
	     * data in a way that differs from the default.
	     * @param {Object} record The record that is served as the base for the ChangeObject to be written to the server.
	     * @return {Object} A literal of name/value keys per ChangeObject, to be written to the server.
	     */
	    getRecordData: function(record, action) {
	    	
	        var		changeObject, batchMember, changeObjects=[], records=[];
	        
	        switch (action) {
	        	
	        	case 'destroy': 
	        		changeObject = Ext.create('Clear.data.ChangeObject', 
        				{	
	        				id: record.id,
    	    				changedPropertyNames:[],
	    		    		newVersion: null,
    	    				previousVersion: record.raw,
    	    				state: 3
    					} 
    				);
	        		break;
	        	case 'update': 
	        		changeObject = Ext.create('Clear.data.ChangeObject', 
        				{
	        				id: record.id,
    	    				changedPropertyNames:Ext.Object.getKeys(record.modified),
	    		    		newVersion: record.data,
    	    				previousVersion: record.raw,
    	    				state: 2
    					} 
    				);
	        		break;
	        	case 'create': 
	        		changeObject = Ext.create('Clear.data.ChangeObject', 
        				{
        					id: record.id,	        			
    	    				changedPropertyNames:Ext.Object.getKeys(record.modified),
	    		    		newVersion: record.data,
    	    				previousVersion: null,
    	    				state: 1
    					} 
    				);
	        		break;
	        	case 'serverBatch':
	        		batchMember = record;
	        		changeObjects=[];
	        		 
	        		records = batchMember.parameters[0];
        			switch (batchMember.localAction) {
        				case 'destroy':
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
        					break;
        				case 'update':
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
	          				break;
        				case 'create':
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
							break;
        			} 
	        	
	        		batchMember.parameters[0] = changeObjects;
	        }
	        return changeObject||batchMember;
	    }
});