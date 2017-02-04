(function () {
  var extPath = CRM.Tasksassignments.extensionPath + 'js/src/tasks-assignments';

  require.config({
    paths: {
      'tasks-assignments': extPath,
      'tasks-assignments/vendor/angular-bootstrap-calendar': extPath + '/vendor-custom/angular-bootstrap-calendar-tpls-custom',
      'tasks-assignments/vendor/angular-checklist-model': extPath + '/vendor/checklist-model/checklist-model',
      'tasks-assignments/vendor/angular-router': extPath + '/vendor/angular-ui-router/release/angular-ui-router.min',
    }
  });

  require(['tasks-assignments/app']);
})(require);
