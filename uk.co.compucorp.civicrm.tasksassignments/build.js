({
    baseUrl : "js",
    name: "ta-main",
    out: "dist/ta-main.js",
    removeCombined: true,
    paths: {
        'angularSelect': 'vendor/angular/select',
        'angularBootstrapCalendar': 'vendor/angular/angular-bootstrap-calendar-tpls-custom',
        'angularChecklistModel': 'vendor/angular/checklist-model',
        'angularRouter': 'vendor/angular/angular-ui-router',
        'crmUi': 'vendor/angular/crmUi',
        'moment': 'vendor/moment.min',
        'requireLib': 'empty:',
        'textAngular': 'vendor/angular/textAngular.min',
        'textAngularRangy': 'vendor/angular/textAngular-rangy.min',
        'textAngularSanitize': 'vendor/angular/textAngular-sanitize.min'
    },
    shim: {
        textAngular: {
            deps: ['textAngularRangy','textAngularSanitize']
        }
    },
    deps: [
        'app',
        'controllers/calendar',
        'controllers/dateList',
        'controllers/documentList',
        'controllers/document',
        'controllers/main',
        'controllers/taskList',
        'controllers/task',
        'controllers/dashboard/navMain',
        'controllers/dashboard/topBar',
        'controllers/modal/modalDialog',
        'controllers/modal/modalDocument',
        'controllers/modal/modalProgress',
        'controllers/modal/modalTask',
        'controllers/modal/modalReminder',
        'controllers/modal/modalAssignment',
        'controllers/externalPage',
        'controllers/settings',
        'directives/civiEvents',
        'directives/iframe',
        'directives/spinner',
        'directives/validate',
        'filters/assignmentType',
        'filters/contactId',
        'filters/date',
        'filters/dateParse',
        'filters/dateType',
        'filters/due',
        'filters/offset',
        'filters/userRole',
        'filters/status',
        'requireLib'
    ],
    wrap: true
})