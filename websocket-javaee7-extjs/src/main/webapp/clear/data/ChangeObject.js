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
 * This class is used by {@link Clear.transaction.BatchManager} and  {@link Clear.data.writer.Json} to pass to the remote action 
 * the changes accumulated to a particular record in the datastore. It is also used by the  {@link Clear.data.reader.Json} to 
 * assist {@link Clear.transaction.BatchManager} in applying the results of the remote action to the store.
 *  
 */
Ext.define('Clear.data.ChangeObject', {
    extend: 'Ext.Base',
    alternateClassName: 'ChangeObject',
    changedPropertyNames: null, 
    newVersion: null,
    previousVersion: null,
    id: null,
    state: 0,
    fields: ['changedPropertyNames', 'newVersion', 'previousVersion', 'state'],
    statics: {
    	stateType: {CREATE:1, UPDATE:2, DELETE:3}
    },
    constructor: function (config) {
    	var me = this;
    	Ext.apply(me, config);
    	me.callParent([config]);
    }
});

