({
    baseUrl : 'src',
    out: 'dist/tasks-assignments.min.js',
    name: 'tasks-assignments',
    skipModuleInsertion: true,
    paths: {
      'common': 'empty:',
      'tasks-assignments/vendor/angular-bootstrap-calendar': 'tasks-assignments/vendor-custom/angular-bootstrap-calendar-tpls-custom',
      'tasks-assignments/vendor/angular-checklist-model': 'tasks-assignments/vendor/checklist-model/checklist-model',
      'tasks-assignments/vendor/angular-router': 'tasks-assignments/vendor/angular-ui-router/release/angular-ui-router.min'
    }
})
