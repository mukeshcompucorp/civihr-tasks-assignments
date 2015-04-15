define(['controllers/controllers',
        'services/contact',
        'services/task'], function(controllers){

    controllers.controller('ModalTaskCtrl',['$scope', '$modalInstance', '$rootScope', '$q', '$log', '$filter',
        'TaskService', 'ContactService', 'data', 'config',
        function($scope, $modalInstance, $rootScope, $q, $log, $filter, TaskService, ContactService, data, config){
            $log.debug('Controller: ModalTaskCtrl');

            $scope.task = {}

            angular.copy(data,$scope.task);

            $scope.task.assignee_contact_id = $scope.task.assignee_contact_id || [];
            $scope.task.source_contact_id = $scope.task.source_contact_id || config.LOGGED_IN_CONTACT_ID;
            $scope.task.target_contact_id = $scope.task.target_contact_id || [config.CONTACT_ID];
            $scope.contacts = $rootScope.cache.contact.arrSearch;
            $scope.showCId = !config.CONTACT_ID;

            $scope.cacheContact = function($item){
                var obj = {};

                obj[$item.id] = {
                    contact_id: $item.id,
                    contact_type: $item.icon_class,
                    sort_name: $item.label,
                    email: $item.description.length ? $item.description[0] : ''
                };

                ContactService.updateCache(obj);
            };

            $scope.refreshContacts = function(input){
                if (!input) {
                    return
                }

                ContactService.search(input).then(function(results){
                    $scope.contacts = results;
                });
            }

            $scope.dpOpen = function($event){
                $event.preventDefault();
                $event.stopPropagation();

                $scope.dpOpened = true;

            }

            $scope.cancel = function(){
                $modalInstance.dismiss('cancel');
            }

            $scope.confirm = function(){
                console.log($scope.task);
                console.log(angular.equals($scope.task,data));

                $scope.task.activity_date_time = $scope.task.activity_date_time || new Date();

                TaskService.save($scope.task).then(function(results){
                    $modalInstance.close(angular.extend(results,$scope.task));
                },function(reason){
                    CRM.alert(reason, 'Error', 'error');
                    $modalInstance.dismiss();
                    return $q.reject();
                });

            }

        }]);
});