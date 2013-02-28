Ext.define('Clear.override.app.Controller', {
    requires: [
       'Ext.app.Controller'          
    ]
}, function () {
	// ENHANCEMENT:allow namings like MyStore to be addressed like getMyStore() and not getMyStoreStore()
	Ext.app.Controller.override({
		createGetters: function(type, refs) {
			type = Ext.String.capitalize(type);
			Ext.Array.each(refs, function(ref) {
					var fn = 'get',
						parts = ref.split('.'),
						pos;

					// Handle namespaced class names. E.g. feed.Add becomes getFeedAddView etc.
					Ext.Array.each(parts, function(part) {
					    fn += Ext.String.capitalize(part);
					});
					
					// --- Prevent StoreStore-like suffixes --- 
					pos = fn.length - type.length;
					if (pos<=0 || fn.substring(pos)!==type) {        	
						fn += type;
					}
					
					if (!this[fn]) {
					    this[fn] = Ext.Function.pass(this['get' + type], [ref], this);
					}
					// Execute it right away
					this[fn](ref);
			},this);
		}
	});
} );