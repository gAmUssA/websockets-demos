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
 * This class is used by {@link Clear.data.DirectStore Clear.data.DirectStore} to send CRUD requests to the server using {@link Ext.direct.Manager Ext.Direct}. 
 * It is a subclass of the {@link Ext.data.proxy.Direct Ext.data.DirectProxy} and normally would not be used directly.
 */
Ext.define('Clear.data.proxy.DirectProxy', {
	extend: 'Ext.data.proxy.Direct',
	requires: [
	           'Ext.direct.Manager',
	           'Clear.data.writer.Json',
	           'Clear.data.reader.Json'
	           ],
    /* Begin Definitions */
    alternateClassName: 'Clear.data.DirectProxy',
    alias: 'proxy.clear',
    /**
     * @cfg {String} defaultReaderType
     * The default registered reader type. Defaults to 'clear' instead of 'json' as in {@link Clear.data.proxy.Proxy}
     * @private
     */
    defaultReaderType: 'clear',
    /**
     * @cfg {String} defaultWriterType
     * The default registered writer type. Defaults to 'clear' instead of 'json' as in {@link Clear.data.proxy.Proxy}
     * @private
     */    
    defaultWriterType: 'clear',
    /**
     * @cfg {Number} timeout
     * The number of milliseconds to wait for a response. Set to 5 minutes vs 30 seconds as in as in {@link Clear.data.proxy.Proxy}
     */
    timeout : 300000,
    
    
    readParamString: '',
    
    /* End Definitions */
    
    constructor: function(config){
        var i, paramCount;
    	config = config || {};
    	config.api = config.api || {};
    	config.api.read = config.api.read || config.directFn;
    	if (!config.api.read) {
			Ext.Error.raise( "Direct Proxy can not be constructed when neither directFn nor api.read can be resolved");
    	}
    	if (config.paramOrder===undefined) { 
    		config.paramOrder = [];
    		// Automatically fill in paramOrder based on arguments length
    		paramCount = config.api.read.directCfg.method.len;
    		for (i=0; i<paramCount; i++) {
    			config.paramOrder.push(i);
    		}
    	}
        this.addEvents(
            /**
             * @event
             * Fires when the server returns the result
             * @param {Ext.data.proxy.Proxy} this
             * @param {Ext.data.Request} result The result that was sent
             * @param {Ext.data.Operation} operation The operation that triggered the request
             */
            'result'
        );
        this.callParent(arguments);
		this.setWriter('clear');
    },
    
	/**
	 * Returns name of the remote action
	 * @param {String} actionType One of the following: 'create', 'read', 'update', 'destroy'
	 */
	getDirectAction: function(actionType) {
		try {
			var directCfg = this.api[actionType].directCfg;
			return directCfg.action;
		} catch (e) {
		}	
	},
	
	/**
	 * Returns name of the remote method
	 * @param {String} actionType One of the following: 'create', 'read', 'update', 'destroy'
	 */
	getDirectMethod: function(actionType) {
		
		try {
			var directCfg = this.api[actionType].directCfg;
			return directCfg.method.name;
		} catch (e) {
		}	
	},

    /**
     * Sets up an exception on the operation. This method replaces the one of the
     * parent and provides a structured exception information versus sole exception message
     * @private
     * @param {Ext.data.Operation} operation The operation
     * @param {Object} response The response
     */

    setException: function(operation, response) {
        operation.setException({action:response.action, method:response.method, message:response.message, where:response.where});
    },
    
    /**
     * Replacement of the ancestor's method to fire {@link #event-result result} 
     * on successful completion of the processsing
     * @private
     * @param {Ext.data.Operation} operation The operation
     * @param {Object} response The response
     */
    processResponse: function(success, operation, request, response, callback, scope){
        var me = this,
            reader,
            result;

        if (success === true) {
            reader = me.getReader();
            result = reader.read(me.extractResponseData(response));

            if (result.success !== false) {
                //see comment in buildRequest for why we include the response object here
                Ext.apply(operation, {
                    response: response,
                    resultSet: result
                });
                // We added this. Should not it be after setSuccessful though?
                if (me.fireEvent('result', this, result, operation)) {                	
                	operation.commitRecords(result.records);
                }
                operation.setCompleted();
                operation.setSuccessful();
            } else {
                operation.setException(result.message);
                me.fireEvent('exception', this, response, operation);
            }
        } else {
            me.setException(operation, response);
            me.fireEvent('exception', this, response, operation);
        }

        //this callback is the one that was passed to the 'read' or 'write' function above
        if (typeof callback == 'function') {
            callback.call(scope || me, operation);
        }

        me.afterRequest(request, success);
    },
    /**
     * @inheritdoc
     */
    read: function() {
    	var operation = arguments[0];
    	// We intercept the parameters as of the read operation
    	this.readParamString = Ext.Object.getValues(operation.params).join(".");
        this.callParent(arguments);
    },
    
    /**
     * @inheritdoc
     * We needed it only to enforce sending direct options from client to server
     */
    buildRequest: function(operation) {
    	
    	var pageStartLimit = {};

    	this.directOptions = operation.directOptions || {}; 
    	Ext.copyTo(pageStartLimit, operation, 'page,start,limit');
    	if (pageStartLimit.limit >0) {   
    		//i.e. negative pageSize in config, 
    		//or 0 pageSize after constructor, 
    		//or 0 defaultPageSize will break pagination
    		Ext.applyIf(this.directOptions, pageStartLimit); 
    	}
        return this.callParent(arguments);
    }
});




