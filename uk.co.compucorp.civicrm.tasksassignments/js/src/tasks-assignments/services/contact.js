define([
    'tasks-assignments/services/services',
    'tasks-assignments/services/utils'
], function (services) {
    'use strict';

    services.factory('ContactService', ['$resource', 'config', '$q', '$filter', '$rootScope', 'UtilsService', '$log',
        function ($resource, config, $q, $filter, $rootScope, UtilsService, $log) {
            $log.debug('Service: ContactService');

            var Contact = $resource(config.url.REST, {
                action: 'get',
                entity: 'contact',
                json: {}
            });

            return {
                get: function (id) {

                    if (!id || (typeof +id !== 'number' && typeof id !== 'object')) {
                        return null
                    }

                    var deferred = $q.defer();

                    Contact.get({
                        'json': {
                            'id': id,
                            'return': 'display_name, sort_name, id, contact_id, contact_type, email',
                            'debug': config.DEBUG
                        }
                    }, function (data) {

                        if (UtilsService.errorHandler(data, 'Unable to fetch contacts', deferred)) {
                            return
                        }

                        deferred.resolve(data.values);
                    }, function () {
                        deferred.reject('Unable to fetch contact');
                    });

                    return deferred.promise;
                },
                search: function (input, custom_params) {

                    if (params && typeof params !== 'object') {
                        return null
                    }

                    var deferred = $q.defer();

                    var params = {};

                    angular.extend(params, custom_params);

                    params.display_name = input;
                    params.return = 'display_name, contact_id, contact_type, email';

                    Contact.get({
                        action: 'get',
                        json: params
                    }, function (data) {
                        if (UtilsService.errorHandler(data, 'Unable to fetch contact list', deferred)) {
                            return
                        }

                        var contacts = [];
                        
                        for (var i in data.values) {
                            contacts.push({
                                label: data.values[i].display_name,
                                description: [data.values[i].email],
                                id: data.values[i].contact_id,
                                icon_class: data.values[i].contact_type
                            });
                        }

                        deferred.resolve(contacts);

                    }, function () {
                        deferred.reject('Unable to fetch contact list');
                    });

                    return deferred.promise;
                },
                updateCache: function (data) {
                    var obj = $rootScope.cache.contact.obj || {}, arr = [], arrSearch = [], contact, contactId;

                    angular.extend(obj, data);

                    for (contactId in obj) {
                        contact = obj[contactId];

                        arr.push(contact);

                        arrSearch.push({
                            description: contact.email ? [contact.email] : [],
                            label: contact.display_name,
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