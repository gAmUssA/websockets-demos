Ext.define('Clear.override.direct.RemotingProvider', {
    requires: [
       'Ext.direct.RemotingProvider'  
    ]
}, function () {

    Ext.direct.RemotingProvider.override({
    	
    	// We patch the configureRequest() method of the RemotingProvider
    	// because we need the transactions to carry the operation's directOptions
   	 	/**
         * Configure a direct request.
         * @private
         * @param {String} action The action being executed
         * @param {Object} method The being executed
         */
    	   configureRequest: function(action, method, args){
    	        var me = this,
    	            callData = method.getCallData(args),
    	            data = callData.data, 
    	            callback = callData.callback, 
    	            scope = callData.scope,
    	            transaction;

    	        transaction = new Ext.direct.Transaction({
    	            provider: me,
    	            args: args,
    	            action: action,
    	            method: method.name,
    	            data: data,
    	            callback: scope && Ext.isFunction(callback) ? Ext.Function.bind(callback, scope) : callback,
    	            directOptions: scope ? scope.directOptions||{}: {}// We pick up from Clear.data.DirectProxy	
    	        });

    	        if (me.fireEvent('beforecall', me, transaction, method) !== false) {
    	            Ext.direct.Manager.addTransaction(transaction);
    	            me.queueTransaction(transaction);
    	            me.fireEvent('call', me, transaction, method);
    	        }
    	  },
    	  
    		// And we patch the getCallData() to include directOptions into JSON

    	   /**
    	     * Gets the Ajax call info for a transaction
    	     * @private
    	     * @param {Ext.direct.Transaction} transaction The transaction
    	     * @return {Object} The call params
    	     */
    	    getCallData: function(transaction){
    	        return {
    	            action: transaction.action,
    	            method: transaction.method,
    	            directOptions: transaction.directOptions, //
    	            data: transaction.data,
    	            type: 'rpc',
    	            tid: transaction.id
    	        };
    	    },
   });
} );