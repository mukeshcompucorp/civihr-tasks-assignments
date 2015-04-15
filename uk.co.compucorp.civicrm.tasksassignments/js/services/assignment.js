define(['services/services',
        'services/utils'], function (services) {

    services.factory('Assignment',['$resource', 'config', '$log', function($resource, config, $log){
        $log.debug('Service: Assignment');

        return $resource(config.path.REST,{
            'action': 'get',
            'entity': 'Case',
            'json': {}
        });

    }]);

    services.factory('AssignmentType',['$resource', 'config', '$log', function($resource, config, $log){
        $log.debug('Service: AssignmentType');

        return $resource(config.path.REST,{
            'action': 'get',
            'entity': 'CaseType',
            'json': {}
        });

    }]);

    services.factory('AssignmentService',['Assignment', 'AssignmentType', '$q', 'config', 'UtilsService', '$log',
        function(Assignment, AssignmentType, $q, config, UtilsService, $log){
        $log.debug('Service: AssignmentService');

        return {
            get: function(){
            },
            getTypes: function(){
                var deferred = $q.defer();

                AssignmentType.get({}, function(data){

                if (UtilsService.errorHandler(data,'Unable to fetch assignment types',deferred)) {
                    return
                }

                deferred.resolve(data.values);
            },function(){
                deferred.reject('Unable to fetch assignment types');
            });

                return deferred.promise;
            },
            getOptions: function(){
            },
            save: function(assignment){

                if (!assignment || typeof assignment !== 'object') {
                    return null;
                }

                var deferred = $q.defer(),
                    params = angular.extend({
                        sequential: 1,
                        debug: config.DEBUG
                    },assignment),
                    val;

                Assignment.save({
                    action: 'create',
                    json: params
                }, null, function(data){

                    if (UtilsService.errorHandler(data,'Unable to save an assignment',deferred)) {
                        return
                    }

                    val = data.values;
                    deferred.resolve(val.length == 1 ? val[0] : null);
                },function(){
                    deferred.reject('Unable to save an assignment');
                });

                return deferred.promise;

            },
            delete: function() {

            }
        }

    }]);

});