/**********************************************************************
 * 
 * Code generated automatically by DirectJNgine
 * Copyright (c) 2009, Pedro Agulló Soliveres
 * 
 * DO NOT MODIFY MANUALLY!!
 * 
 **********************************************************************/

Ext.namespace( 'Clear.direct.config');
Ext.namespace( 'Clear.direct.action');

Clear.direct.config.PROVIDER_BASE_URL=window.location.protocol + '//' + window.location.host + '/' + (window.location.pathname.split('/').length>2 ? window.location.pathname.split('/')[1]+ '/' : '')  + 'djn/directprovider';

Clear.direct.config.POLLING_URLS = {
}

Clear.direct.config.REMOTING_API = {
  url: Clear.direct.config.PROVIDER_BASE_URL,
  type: 'remoting',
  namespace: Clear.direct.action,
  actions: {
    BatchGateway: [
      {
        name: 'execute'/*(java.util.List) => java.util.List */,
        len: 1,
        formHandler: false
      }
    ]
  }
}

