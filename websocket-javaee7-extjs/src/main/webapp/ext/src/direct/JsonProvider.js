/*
This file is part of Ext JS 4.2

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

Pre-release code in the Ext repository is intended for development purposes only and will
not always be stable. 

Use of pre-release code is permitted with your application at your own risk under standard
Ext license terms. Public redistribution is prohibited.

For early licensing, please contact us at licensing@sencha.com

Build date: 2013-02-13 19:36:35 (686c47f8f04c589246d9f000f87d2d6392c82af5)
*/
/**
 * A base provider for communicating using JSON. This is an abstract class
 * and should not be instanced directly.
 *
 * @abstract
 */

Ext.define('Ext.direct.JsonProvider', {
    extend: 'Ext.direct.Provider',
    alias:  'direct.jsonprovider',

    uses: [
        'Ext.direct.ExceptionEvent',
        'Ext.direct.Manager'
    ],

   /**
    * Parse the JSON response
    * @private
    *
    * @param {Object} response The XHR response object
    *
    * @return {Object} The data in the response.
    */
   parseResponse: function(response) {
        if (!Ext.isEmpty(response.responseText)) {
            if (Ext.isObject(response.responseText)) {
                return response.responseText;
            }

            return Ext.decode(response.responseText);
        }

        return null;
    },

    /**
     * Creates a set of events based on the XHR response
     *
     * @param {Object} response The XHR response
     *
     * @return {Ext.direct.Event[]} An array of Ext.direct.Event
     */
    createEvents: function(response) {
        var me = this,
            data = null,
            events = [],
            event, i, len;

        try {
            data = me.parseResponse(response);
        }
        catch (e) {
            event = new Ext.direct.ExceptionEvent({
                data: e,
                xhr: response,
                code: Ext.direct.Manager.exceptions.PARSE,
                message: 'Error parsing json response: \n\n ' + e
            });

            return [event];
        }

        if (Ext.isArray(data)) {
            for (i = 0, len = data.length; i < len; ++i) {
                events.push(me.createEvent(data[i]));
            }
        }
        else if (Ext.isObject(data)) {
            events.push(me.createEvent(data));
        }

        return events;
    },

    /**
     * Create an event from a response object
     *
     * @param {Object} response Response object
     *
     * @return {Ext.direct.Event} The event
     */
    createEvent: function(response) {
        return Ext.create('direct.' + response.type, response);
    }
});