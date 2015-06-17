define([
    'moment',
    'angularBootstrapCalendar',
    'angularChecklistModel',
    'angularRouter',
    'angularSelect',
    'textAngular',
    'config',
    'settings',
    'controllers/controllers',
    'directives/directives',
    'filters/filters',
    'services/services'], function(moment){

    angular.module('civitasks.run',[
        'angularFileUpload',
        'ngRoute',
        'ngResource',
        'ngSanitize',
        'ui.bootstrap',
        'ui.router',
        'ui.select',
        'mwl.calendar',
        'textAngular',
        'checklist-model',
        'civitasks.config',
        'civitasks.controllers',
        'civitasks.directives',
        'civitasks.filters',
        'civitasks.services',
        'civitasks.settings',
    ]).run(['config', 'settings', '$rootScope', '$rootElement', '$q', '$location', 'DocumentService',
        'TaskService', 'AssignmentService', 'KeyDateService', 'ContactService', '$log',
        function(config, settings, $rootScope, $rootElement, $q, $location, DocumentService, TaskService, AssignmentService,
                 KeyDateService, ContactService, $log){
            $log.debug('civitasks.run');

            $rootScope.pathTpl = config.path.TPL;
            $rootScope.prefix = config.CLASS_NAME_PREFIX;
            $rootScope.url = config.url;
            $rootScope.location = $location;
            $rootScope.settings = settings;
            $rootScope.cache = {
                contact: {
                    obj: {},
                    arr: [],
                    addSearch: []
                },
                assignment: {
                    obj: {},
                    arr: [],
                    arrSearch: []
                },
                assignmentType: {
                    obj: {},
                    arr: []
                },
                //TODO
                dateType: {
                    obj: {
                        period_start_date: 'Contract Start Date',
                        period_end_date: 'Contract End Date',
                        birth_date: 'Birthday',
                        initial_join_date: 'Initial Join Date',
                        final_termination_date: 'Final Termination Date',
                        probation_end_date: 'Probation End Date'
                    },
                    arr: []
                },
                documentType: {
                    obj: {},
                    arr: []
                },
                documentStatus: {
                    obj: {},
                    arr: []
                },
                documentStatusResolve: config.status.resolve.DOCUMENT,
                taskType: {
                    obj: {},
                    arr: []
                },
                taskStatus: {
                    obj: {},
                    arr: []
                },
                taskStatusResolve: config.status.resolve.TASK
            };

            TaskService.getOptions().then(function(options){
                angular.extend($rootScope.cache,options);
            });

            DocumentService.getOptions().then(function(options){
                angular.extend($rootScope.cache,options);
            });

            AssignmentService.getTypes().then(function(types){
                angular.extend($rootScope.cache.assignmentType.obj,types);
                angular.forEach(types, function(type) {
                    this.push(type);
                }, $rootScope.cache.assignmentType.arr);
            });

            ContactService.get({'IN': [config.LOGGED_IN_CONTACT_ID]}).then(function(data){
                ContactService.updateCache(data);
            });

            angular.forEach($rootScope.cache.dateType.obj, function(value, key){
                this.push({
                    key: key,
                    value: value
                })
            },$rootScope.cache.dateType.arr);

            $rootScope.$on('$stateChangeSuccess', function() {
                $rootElement.removeClass('ct-page-loading');
            });

        }
    ]);

    angular.module('civitasks.appDashboard',['civitasks.run'])
        .config(['config', '$resourceProvider','$httpProvider', '$logProvider',
            '$urlRouterProvider', '$stateProvider','calendarConfigProvider', 'uiSelectConfig',
            function(config, $resourceProvider, $httpProvider, $logProvider,
                     $urlRouterProvider, $stateProvider, calendarConfigProvider, uiSelectConfig){
                $logProvider.debugEnabled(config.debug);

                $urlRouterProvider.otherwise("/tasks");

                $stateProvider.
                    state('tasks', {
                        url: '/tasks',
                        controller: 'TaskListCtrl',
                        templateUrl: config.path.TPL+'dashboard/tasks.html',
                        resolve: {
                            taskList: ['$q', 'TaskService',function($q, TaskService){
                                var deferred = $q.defer();

                                $q.all([
                                    TaskService.get({
                                        'sequential': 0,
                                        'assignee_contact_id': config.LOGGED_IN_CONTACT_ID,
                                        'status_id': {
                                            'NOT IN': config.status.resolve.TASK
                                        }
                                    }),
                                    TaskService.get({
                                        'sequential': 0,
                                        'source_contact_id': config.LOGGED_IN_CONTACT_ID,
                                        'status_id': {
                                            'NOT IN': config.status.resolve.TASK
                                        }
                                    })
                                ]).then(function(results){
                                    var taskId, taskList = [];

                                    angular.extend(results[0],results[1]);

                                    for (taskId in results[0]) {
                                        taskList.push(results[0][taskId]);
                                    }

                                    deferred.resolve(taskList);

                                });

                                return deferred.promise;
                            }]
                        }
                    }).
                    state('documents', {
                        url: '/documents',
                        controller: 'DocumentListCtrl',
                        templateUrl: config.path.TPL+'dashboard/documents.html',
                        resolve: {
                            documentList: ['$q', 'DocumentService', function($q, DocumentService){
                                var deferred = $q.defer();

                                $q.all([
                                    DocumentService.get({
                                        'sequential': 0,
                                        'assignee_contact_id': config.LOGGED_IN_CONTACT_ID,
                                        'status_id': {
                                            'NOT IN': config.status.resolve.DOCUMENT
                                        }
                                    }),
                                    DocumentService.get({
                                        'sequential': 0,
                                        'source_contact_id': config.LOGGED_IN_CONTACT_ID,
                                        'status_id': {
                                            'NOT IN': config.status.resolve.DOCUMENT
                                        }
                                    })
                                ]).then(function(results){
                                    var documentId, documentList = [];

                                    angular.extend(results[0],results[1]);

                                    for (documentId in results[0]) {
                                        documentList.push(results[0][documentId]);
                                    }

                                    deferred.resolve(documentList);

                                });

                                return deferred.promise;
                            }]
                        }
                    }).
                    state('assignments', {
                        url: '/assignments',
                        controller: 'ExternalPageCtrl',
                        templateUrl: config.path.TPL+'dashboard/assignments.html'
                    }).
                    state('calendar', {
                        abstract: true,
                        controller: 'CalendarCtrl',
                        templateUrl: config.path.TPL+'dashboard/calendar.html',
                        resolve: {
                            documentList: ['$q', 'DocumentService','settings', function($q, DocumentService, settings){
                                var deferred = $q.defer();

                                if (!+settings.tabEnabled.documents) {
                                    deferred.resolve([]);
                                }

                                $q.all([
                                    DocumentService.get({
                                        'sequential': 0,
                                        'assignee_contact_id': config.LOGGED_IN_CONTACT_ID,
                                        'status_id': {
                                            'NOT IN': config.status.resolve.DOCUMENT
                                        }
                                    }),
                                    DocumentService.get({
                                        'sequential': 0,
                                        'source_contact_id': config.LOGGED_IN_CONTACT_ID,
                                        'status_id': {
                                            'NOT IN': config.status.resolve.DOCUMENT
                                        }
                                    })
                                ]).then(function(results){
                                    var documentId, documentList = [];

                                    angular.extend(results[0],results[1]);

                                    for (documentId in results[0]) {
                                        documentList.push(results[0][documentId]);
                                    }

                                    deferred.resolve(documentList);

                                });

                                return deferred.promise;
                            }],
                            taskList: ['$q', 'TaskService',function($q, TaskService){
                                var deferred = $q.defer();

                                $q.all([
                                    TaskService.get({
                                        'sequential': 0,
                                        'assignee_contact_id': config.LOGGED_IN_CONTACT_ID,
                                        'status_id': {
                                            'NOT IN': config.status.resolve.TASK
                                        }
                                    }),
                                    TaskService.get({
                                        'sequential': 0,
                                        'source_contact_id': config.LOGGED_IN_CONTACT_ID,
                                        'status_id': {
                                            'NOT IN': config.status.resolve.TASK
                                        }
                                    })
                                ]).then(function(results){
                                    var taskId, taskList = [];

                                    angular.extend(results[0],results[1]);

                                    for (taskId in results[0]) {
                                        taskList.push(results[0][taskId]);
                                    }

                                    deferred.resolve(taskList);

                                });

                                return deferred.promise;
                            }]
                        }
                    }).
                    state('calendar.mwl', {
                        url: '/calendar',
                        views: {
                            'documentList': {
                                controller: 'DocumentListCtrl',
                                templateUrl: config.path.TPL+'dashboard/calendar.documentList.html'
                            },
                            'taskList': {
                                controller: 'TaskListCtrl',
                                templateUrl: config.path.TPL+'dashboard/calendar.taskList.html'
                            }
                        }
                    }).
                    state('calendar.mwl.day', {
                        params: {
                            calendarView: 'day'
                        }
                    }).
                    state('calendar.mwl.month', {
                        params: {
                            calendarView: 'month'
                        }
                    }).
                    state('calendar.mwl.week', {
                        params: {
                            calendarView: 'week'
                        }
                    }).
                    state('reports', {
                        url: '/reports',
                        controller: 'ExternalPageCtrl',
                        templateUrl: config.path.TPL+'dashboard/reports.html'
                    }).
                    state('keyDates', {
                        url: '/key-dates',
                        controller: 'DateListCtrl',
                        templateUrl: config.path.TPL+'dashboard/key-dates.html',
                        resolve: {
                            contactList: ['KeyDateService',function(KeyDateService){
                                return KeyDateService.get(moment().startOf('month'),moment().endOf('month'));
                            }]
                        }
                    }).
                    state('settings', {
                        url: '/settings',
                        controller: 'SettingsCtrl',
                        templateUrl: config.path.TPL+'dashboard/settings.html'
                    });

                $resourceProvider.defaults.stripTrailingSlashes = false;

                $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

                calendarConfigProvider.setDateFormats({
                    weekDay: 'ddd'
                });

                uiSelectConfig.theme = 'bootstrap';
            }
        ]);

    angular.module('civitasks.appDocuments',['civitasks.run'])
        .config(['config','$routeProvider','$resourceProvider','$httpProvider','uiSelectConfig','$logProvider',
            function(config, $routeProvider, $resourceProvider, $httpProvider, uiSelectConfig, $logProvider){
                $logProvider.debugEnabled(config.debug);

                $routeProvider.
                    when('/', {
                        controller: 'DocumentListCtrl',
                        templateUrl: config.path.TPL+'contact/documents.html',
                        resolve: {
                            documentList: ['DocumentService',function(DocumentService){
                                return DocumentService.get({
                                    'target_contact_id': config.CONTACT_ID,
                                    'status_id': {
                                        'NOT IN': config.status.resolve.DOCUMENT
                                    }
                                });
                            }]
                        }
                    }
                ).otherwise({redirectTo:'/'});

                $resourceProvider.defaults.stripTrailingSlashes = false;

                $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

                uiSelectConfig.theme = 'bootstrap';
            }
        ]);

    angular.module('civitasks.appTasks',['civitasks.run'])
        .config(['config','$routeProvider','$resourceProvider','$httpProvider','uiSelectConfig','$logProvider',
            function(config, $routeProvider, $resourceProvider, $httpProvider, uiSelectConfig, $logProvider){
                $logProvider.debugEnabled(config.debug);

                $routeProvider.
                    when('/', {
                        controller: 'TaskListCtrl',
                        templateUrl: config.path.TPL+'contact/tasks.html',
                        resolve: {
                            taskList: ['TaskService',function(TaskService){
                                return TaskService.get({
                                    'target_contact_id': config.CONTACT_ID,
                                    'status_id': {
                                        'NOT IN': config.status.resolve.TASK
                                    }
                                });
                            }]
                        }
                    }
                ).otherwise({redirectTo:'/'});

                $resourceProvider.defaults.stripTrailingSlashes = false;

                $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

                uiSelectConfig.theme = 'bootstrap';
            }
        ]);

});