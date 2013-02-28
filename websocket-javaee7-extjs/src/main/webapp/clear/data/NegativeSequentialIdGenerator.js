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
 * This class is a negative sequential id generator, modified from Don Griffin's original sequential generator.
 * A typical use case of this class would be like so:
 *
 *     Ext.define('MyApp.data.MyModel', {
 *         extend: 'Ext.data.Model',
 *         idgen: 'negativesequential'
 *     });
 *     // assigns id's of -1, -2, -3, etc.
 *
 * This id generator is used to maintain referential integrity across models involved in {@link #sync store sync()} 
 * when records of the store have `child` records associated via *hasMany* relations and the primaryKey of
 * the *master* correspond to the database field that is automatically assigned by the server
 * (eg. autoincrement, sequence).
 *
 * A typical use case is two database tables related with primary and foreign keys.
 * Developer may add a new *master* record with the primary key equal to -1, then add
 * two *child* records each containing foreignKey equal to -1. The primary keys of the child
 * records will contain -1 and -2. In the course of {@link #sync sync()} server-side code
 * will insert the record to the *master* database which and next autoincremented value of the
 * primary key will become 15  - for the sake of example. Then, the server-side code will
 * replace each foreignKey occurence of -1 in *child* records with 15, prior to insert. The
 * replacement values of *child* -1 and -2 get memorized as well, so the process can go to
 * any level of recursion.
 *     
 * *NOTE*: You should not configure anything other then negative seed value.
 * 
 * *NOTE*: Clear Components override the {@link Ext.data.Model#setId setId} implementation so that
 * assignment of the id does not make the record loose the `phantom` status. Standard implementation
 * used to declare non-phantom all records created with id or granted id. 
 */
Ext.define('Clear.data.NegativeSequentialIdGenerator', {
    extend: 'Ext.data.IdGenerator',
    alias: 'idgen.negativesequential',

    constructor: function() {
        var me = this;
        me.callParent(arguments);
    },

    /**
     * @cfg {Number} seed
     * The number at which to start generating sequential id's. The default is -1.
     */
    seed: -1,

    /**
     * Generates and returns the next id.
     * @return {Number} The next id.
     */
    generate: function () {
        return this.seed--;
    }
});