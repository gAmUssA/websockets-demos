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
 * This class is used by {@link Clear.transaction.BatchManager BatchManager} to arrange array 
 * of server-side method calls to be transactionally executed within a single XMLHTTP request.
 * 
 * Most common use is in the course of the {@link Clear.data.DirectStore#sync sync()}, when all modifications accumulated
 * within the hierarchy of the `Clear.data.DirectStore` and it's children (stores associated to the records of the
 * parental stores through *hasMany* associations) are sent to the server as a batch of actions.
 * Each of the above actions is represented by a `BatchMember` element. The corresponding server-side
 * actions should perform bulk insert, bulk delete and bulk update actions.
 * 
 */
Ext.define('Clear.transaction.BatchMember', {
    /* Begin Definitions */
    alias: 'batchMember',
    
    /** Fully specified name of the Java class as in `com.farata.actions.CompanyAction`
     */
	className:'',
    /** Method name as `getCustomers` or `getCustomers_deleteItems`
     */
	methodName:'',
    /** Parameters for the method
     */ 
	parameters:[],
	autoSyncSubtopic:'',
    /** Results of the method execution
     */ 
	result:{},

    /* End Definitions */
    
    
    constructor: function(config) {
    	Ext.apply(this,config);    
    },
    
    toString:function() {
		var me = this;
		return [
			"clear.transaction.BatchMember {",
			" \nclassName: ", me.className,
			" \nmethodName: ", me.methodName,
			" \nparameters: ", me.parameters,
			" \nautoSyncSubtopic: ", me.autoSyncSubtopic,
			"\n}"
		].join("");     	
    }
});




