Ext.define('Clear.override.app.Controller', {
    override: 'Ext.app.Controller',
    statics: {
        getGetterName: function (name, kindUpper) {
            var fn = 'get',
                parts = name.split('.'),
                numParts = parts.length,
                index,
                pos;

            // Handle namespaced class names. E.g. feed.Add becomes getFeedAddView etc.
            for (index = 0; index < numParts; index++) {
                fn += Ext.String.capitalize(parts[index]);
            }

            // --- Prevent StoreStore-like suffixes ---
            pos = fn.length - kindUpper.length;
            if (pos <= 0 || fn.substring(pos) !== kindUpper) {
                fn += kindUpper;
            }

            return fn;
        }
    }
});