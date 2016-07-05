define([
    'tasks-assignments/controllers/controllers',
    'tasks-assignments/services/contact'
], function (controllers) {
    'use strict';

    controllers.controller('AssignmentsCtrl', ['$scope', '$log', '$uibModal', '$rootElement', '$rootScope', '$state', 'config',
        function ($scope, $log, $modal, $rootElement, $rootScope, $state, config) {
            $log.info('Controller: AssignmentsCtrl');
        }
    ]);
});
