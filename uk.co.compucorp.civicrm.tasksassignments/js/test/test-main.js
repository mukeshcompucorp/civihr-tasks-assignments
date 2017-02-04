var TEST_REGEXP = /(spec|test)\.js$/i;
var allTestFiles = [];
var mocksPath = CRM.Tasksassignments.extensionPath + '/js/test/mocks';
var srcPath = CRM.Tasksassignments.extensionPath + '/js/src/tasks-assignments';

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    allTestFiles.push(file);
  }
});

require.config({
  deps: allTestFiles,
  waitSeconds: 60,
  paths: {
    'tasks-assignments': srcPath,
    'tasks-assignments/vendor/angular-bootstrap-calendar': srcPath + '/vendor-custom/angular-bootstrap-calendar-tpls-custom',
    'tasks-assignments/vendor/angular-checklist-model': srcPath + '/vendor/checklist-model/checklist-model',
    'tasks-assignments/vendor/angular-router': srcPath + '/vendor/angular-ui-router/release/angular-ui-router.min',
    'mocks': mocksPath
  },
  callback: function () {
    window.__karma__.start();
  }
});
