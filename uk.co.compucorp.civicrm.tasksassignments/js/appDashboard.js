define(['angularSelect', 'textAngular', 'config', 'controllers/controllers', 'directives/directives',    'filters/filters', 'services/services'], function(){    var app = angular.module('civitasks.appDashboard',[        'ngRoute',        'ngResource',        'ngSanitize',        'ui.bootstrap',        'ui.select',        'textAngular',        'civitasks.config',        'civitasks.controllers',        'civitasks.directives',        'civitasks.filters',        'civitasks.services'    ]);    app.config(['config','$routeProvider','$resourceProvider','$httpProvider','uiSelectConfig','$logProvider',        function(config, $routeProvider, $resourceProvider, $httpProvider, uiSelectConfig, $logProvider){            $logProvider.debugEnabled(config.debug);            $routeProvider.                when('/tasks', {                    controller: 'TaskListCtrl',                    templateUrl: config.path.TPL+'dashboard/tasks.html?v='+(new Date().getTime()),                    resolve: {                        taskList: ['TaskService',function(TaskService){                            return TaskService.get();                        }]                    }                }).                when('/documents', {                    templateUrl: config.path.TPL+'dashboard/documents.html?v='+(new Date().getTime())                }).                when('/assignments', {                    templateUrl: config.path.TPL+'dashboard/assignments.html?v='+(new Date().getTime())                }).                when('/calendar', {                    templateUrl: config.path.TPL+'dashboard/calendar.html?v='+(new Date().getTime())                }).                when('/reports', {                    templateUrl: config.path.TPL+'dashboard/reports.html?v='+(new Date().getTime())                }).                when('/key-dates', {                    templateUrl: config.path.TPL+'dashboard/key-dates.html?v='+(new Date().getTime())                }).                otherwise({redirectTo:'/tasks'});            $resourceProvider.defaults.stripTrailingSlashes = false;            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';            uiSelectConfig.theme = 'bootstrap';        }    ]);    app.run(['config', '$rootScope','$q', 'TaskService', '$log',        function(config, $rootScope, $q, TaskService, $log, $rootElement){            $log.debug('appDashboard.run');            $rootScope.pathTpl = config.path.TPL;            $rootScope.prefix = config.CLASS_NAME_PREFIX;            $rootScope.cache = {                contact: {                    obj: {},                    arr: [],                    addSearch: []                },                taskType: {                    obj: {},                    arr: []                },                taskStatus: {                    obj: {},                    arr: []                },                taskStatusResolve: [2, 3, 6, 8]                //TODO            };            TaskService.getOptions().then(function(options){                angular.extend($rootScope.cache,options);            });        }    ]);    return app;});