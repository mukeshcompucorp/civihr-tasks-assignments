var module, reqTa = require.config({
    context: 'tasksassignments',
    baseUrl: CRM.Tasksassignments.extensionPath+'js',
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        angularSelect: 'vendor/angular/select',
        crmUi: 'vendor/angular/crmUi',
        moment: 'vendor/moment.min',
        requireLib: CRM.vars.reqAngular.requireLib,
        textAngular: 'vendor/angular/textAngular.min',
        textAngularRangy: 'vendor/angular/textAngular-rangy.min',
        textAngularSanitize: 'vendor/angular/textAngular-sanitize.min'
    },
    shim: {
        textAngular: {
            deps: ['textAngularRangy','textAngularSanitize']
        }
    }
});

reqTa([
    'appContact',
    'appDashboard',
    'controllers/documentList',
    'controllers/document',
    'controllers/taskList',
    'controllers/task',
    'controllers/dashboard/navMain',
    'controllers/dashboard/topBar',
    'controllers/modal/modalDocument',
    'controllers/modal/modalTask',
    'controllers/modal/modalAssignment',
    'controllers/externalPage',
    'directives/civiEvents',
    'directives/iframe',
    'directives/spinner',
    'filters/dateParse',
    'requireLib'
],function(){
    'use strict';

    document.addEventListener('taInit', function(e){
        angular.bootstrap(document.getElementById('civitasks'), ['civitasks.'+ e.detail]);
    });

    document.dispatchEvent(new CustomEvent('taReady'));
})