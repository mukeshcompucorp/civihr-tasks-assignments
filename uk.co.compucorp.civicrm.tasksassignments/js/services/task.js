define(['services/services'], function (services) {    services.factory('Task',['$resource', 'settings', '$log', function($resource, settings, $log){        $log.debug('Service: Task');        return $resource(settings.pathRest,{            'action': 'get',            'entity': 'Activity',            'json': {}        });    }]);    /*    services.factory('TaskActivity',['$resource', 'settings', '$log', function($resource, settings, $log){        $log.debug('Service: TaskActivity');        return $resource(settings.pathRest,{            action: 'get',            entity: 'TaskActivity',            json: {}        });    }]);    */    services.factory('TaskService',['Task', '$q', 'settings', '$log', function(Task, $q, settings, $log){        $log.debug('Service: TaskService');        return {            get: function(params){                var deferred = $q.defer();                params = params && typeof params === 'object' ? params : {};                params = angular.extend({                    'sequential': '1',                    'target_contact_id': settings.contactId,                    'return': 'activity_date_time, activity_type_id, assignee_contact_id, details, id, source_contact_id, target_contact_id'                },params);                Task.get({json: params}, function(data){                    deferred.resolve(data.values);                },function(){                    deferred.reject('Unable to fetch tasks list');                });                return deferred.promise;            },            getOptions: function(){                var deferred = $q.defer(), i = 0, len,                    options = {                        taskType: {                            arr: [],                            obj: {}                        },                        status: {}                    }                Task.get({                    action: 'getoptions',                    json: {                        field: 'activity_type_id'                    }                }, function(data){                    var optionId;                    for (optionId in data.values) {                        options.taskType.arr.push({                            key: optionId,                            value: data.values[optionId]                        })                    }                    options.taskType.obj = data.values;                    deferred.resolve(options);                });                return deferred.promise;            }        }    }]);});