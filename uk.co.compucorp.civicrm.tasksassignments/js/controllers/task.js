define(['controllers/controllers'], function(controllers){    controllers.controller('TaskCtrl',['$scope', '$log',        function($scope, $log){            $log.debug('Controller: TaskCtrl');            $scope.isCollapsed = true;            $scope.due = new Date($scope.task.activity_date_time) < new Date();            $scope.task.activity_date_time = Date.parse($scope.task.activity_date_time);            console.log($scope.task);        }]);});