({
  baseUrl: 'src',
  out: 'dist/tasks-assignments.min.js',
  name: 'tasks-assignments',
  skipModuleInsertion: true,
  generateSourceMaps: true,
  useSourceUrl: true,
  paths: {
    'common': 'empty:',
    'tasks-assignments/vendor/angular-bootstrap-calendar': 'tasks-assignments/vendor/angular/angular-bootstrap-calendar-tpls-custom',
    'tasks-assignments/vendor/angular-checklist-model': 'tasks-assignments/vendor/angular/checklist-model',
    'tasks-assignments/vendor/angular-router': 'tasks-assignments/vendor/angular/angular-ui-router',
  }
})
