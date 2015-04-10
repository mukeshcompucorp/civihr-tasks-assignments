define(['services/services',
        'services/utils'], function (services) {

    services.factory('ContactService', ['$resource', 'config', '$q', '$filter', '$rootScope','UtilsService','$log',
        function ($resource, config, $q, $filter, $rootScope, UtilsService, $log) {
            $log.debug('Service: ContactService');

        var Contact = $resource(config.path.REST, {
            action: 'get',
            entity: 'contact',
            json: {}
        });

        return {
            get: function(id) {

                if (!id || (typeof +id !== 'number' && typeof id !== 'object') ) {
                    return null
                }

                var deferred = $q.defer();

                Contact.get({
                    'json': {
                        'id': id,
                        'return': 'sort_name, id, contact_id, contact_type, email',
                        'debug': config.DEBUG
                }}, function(data){

                    if (UtilsService.errorHandler(data,'Unable to fetch contacts',deferred)) {
                        return
                    }

                    deferred.resolve(data.values);
                },function(){
                    deferred.reject('Unable to fetch contact');
                });

                return deferred.promise;
            },
            search: function(input, params){

                if (params && typeof params !== 'object') {
                    return null
                }

                var deferred = $q.defer(),
                    params = params || {};

                Contact.get({
                    action: 'getlist',
                    json: {
                        input: input,
                        params: params,
                        debug: config.DEBUG
                }}, function(data){

                    if (UtilsService.errorHandler(data,'Unable to fetch contact list',deferred)) {
                        return
                    }

                    deferred.resolve(data.values);

                },function(){
                    deferred.reject('Unable to fetch contact list');
                });

                return deferred.promise;
            },
            updateCache: function(data){
                var obj = $rootScope.cache.contact.obj || {}, arr = [], arrSearch = [], contact, contactId;

                angular.extend(obj,data);

                for (contactId in obj) {
                    contact = obj[contactId];

                    arr.push(contact);

                    arrSearch.push({
                        description: contact.email ? [contact.email] : [],
                        label: contact.sort_name,
                        icon_class: contact.contact_type,
                        id: contact.contact_id
                    });
                }

                arr = $filter('orderBy')(arr, 'sort_name');
                arrSearch = $filter('orderBy')(arrSearch, 'label');

                $rootScope.cache.contact = {
                    arr: arr,
                    obj: obj,
                    arrSearch: arrSearch
                };
            }
        }

    }]);

});