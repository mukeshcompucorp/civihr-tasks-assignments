/* globals inject */
/* eslint-env amd, jasmine */

define([
  'common/angular',
  'common/moment',
  'common/lodash',
  'mocks/fabricators/document',
  'mocks/fabricators/contact',
  'mocks/fabricators/assignment',
  'tasks-assignments/app'
], function (angular, moment, _, documentFabricator, contactFabricator, assignmentFabricator) {
  'use strict';

  describe('DocumentListCtrl', function () {
    var $controller, $rootScope, DocumentService, $scope, $q, $httpBackend, config, mockDocument, $filter;

    beforeEach(module('civitasks.appDashboard'));
    beforeEach(inject(function (_$controller_, _$rootScope_, _DocumentService_, _$httpBackend_, _$q_, _config_, _$filter_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $filter = _$filter_;
      $scope = $rootScope.$new();
      $q = _$q_;
      config = _config_;
      DocumentService = _DocumentService_;
      $httpBackend = _$httpBackend_;
      mockDocument = documentFabricator.single();

      // Avoid actual API calls
      $httpBackend.whenGET(/action=/).respond({});
    }));

    beforeEach(function () {
      spyOn(DocumentService, 'get').and.returnValue($q.resolve([]));
      spyOn(DocumentService, 'cacheContactsAndAssignments').and.returnValue($q.resolve([]));
      spyOn(DocumentService, 'save').and.callFake(function () {
        mockDocument.status_id = '4';

        return $q.resolve(mockDocument);
      });
    });

    describe('init()', function () {
      beforeEach(function () {
        initController();
      });

      it('calls document service to cache contacts and assigments', function () {
        expect(DocumentService.cacheContactsAndAssignments).toHaveBeenCalled();
      });

      it('checks if default document status are defined for filter in T&A dashboard', function () {
        expect($scope.filterParamsHolder.documentStatus).toEqual(['1', '2']);
      });

      it('checks if default document status are not defined for filter in contact page', function () {
        expect($scope.filterParams.documentStatus).toEqual([]);
      });
    });

    describe('changeStatus()', function () {
      beforeEach(function () {
        initController();
        $scope.document = mockDocument;
      });

      afterEach(function () {
        $rootScope.$apply();
      });

      describe('when the status is empty', function () {
        beforeEach(function () {
          $scope.changeStatus($scope.document, null);
        });

        it('does not update the document status', function () {
          expect(DocumentService.save).not.toHaveBeenCalled();
        });
      });

      describe('when the status is not empty', function () {
        beforeEach(function () {
          $scope.changeStatus($scope.document, '4');
        });

        it('updates the document status', function () {
          expect(DocumentService.save).toHaveBeenCalledWith({ id: $scope.document.id, status_id: '4' });
          expect($scope.document.status_id).toBe('4');
        });
      });
    });

    describe('labelDateRange()', function () {
      var fromDate = moment().startOf('day').toDate();
      var untilDate = moment().add(1, 'month').startOf('day').toDate();

      beforeEach(function () {
        initController();
      });

      afterEach(function () {
        $rootScope.$apply();
      });

      it('formats and creates date range label', function () {
        expect($scope.label.dateRange).toBe($filter('date')(fromDate, 'dd/MM/yyyy') + ' - ' + $filter('date')(untilDate, 'dd/MM/yyyy'));
      });

      describe('when both form and until date are available', function () {
        beforeEach(function () {
          $scope.filterParams.dateRange = {
            from: moment().startOf('day').toDate(),
            until: moment().add(2, 'month').startOf('day').toDate()
          };
          $scope.labelDateRange();
        });

        it('formats and creates date range label', function () {
          expect($scope.label.dateRange).toBe($filter('date')($scope.filterParams.dateRange.from, 'dd/MM/yyyy') + ' - ' + $filter('date')($scope.filterParams.dateRange.until, 'dd/MM/yyyy'));
        });
      });

      describe('when only form date is available', function () {
        beforeEach(function () {
          $scope.filterParams.dateRange = {
            from: moment().startOf('day').toDate(),
            until: ''
          };
          $scope.labelDateRange();
        });

        it('formats and creates date range label containing form date only', function () {
          expect($scope.label.dateRange).toBe('From: ' + $filter('date')($scope.filterParams.dateRange.from, 'dd/MM/yyyy'));
        });
      });

      describe('when only until date is available', function () {
        beforeEach(function () {
          $scope.filterParams.dateRange = {
            from: '',
            until: moment().add(2, 'month').startOf('day').toDate()
          };
          $scope.labelDateRange();
        });

        it('formats and creates date range label containing until date only', function () {
          expect($scope.label.dateRange).toBe('Until: ' + $filter('date')($scope.filterParams.dateRange.until, 'dd/MM/yyyy'));
        });
      });
    });

    describe('sortBy', function () {
      var sortedDocumentList;

      beforeEach(function () {
        initController();

        _.each(documentFabricator.documentStatus(), function (option) {
          $rootScope.cache.documentStatus.obj[option.key] = option.value;
        });

        _.each(documentFabricator.documentTypes(), function (option) {
          $rootScope.cache.documentType.obj[option.key] = option.value;
        });

        _.each(contactFabricator.list(), function (option) {
          $rootScope.cache.contact.obj[option.contact_id] = option;
        });

        $rootScope.cache.assignmentType.obj = assignmentFabricator.assignmentTypes();
        $rootScope.cache.assignment.obj = assignmentFabricator.listAssignments();
      });

      afterEach(function () {
        $rootScope.$apply();
      });

      describe('document are sorted by docuument type', function () {
        beforeEach(function () {
          sortedDocumentList = _.sortBy($scope.list, function (doc) {
            return $rootScope.cache.documentType.obj[doc.activity_type_id];
          });

          $scope.sortBy('type');
        });

        it('lists documents by types', function () {
          expect($scope.list).toEqual(sortedDocumentList);
        });
      });

      describe('documents are sorted by document status', function () {
        beforeEach(function () {
          sortedDocumentList = _.sortBy($scope.list, function (doc) {
            return $rootScope.cache.documentStatus.obj[doc.status_id];
          });
          $scope.sortBy('status_id');
        });

        it('lists documents by document status', function () {
          expect($scope.list).toEqual(sortedDocumentList);
        });
      });

      describe('document are sorted by document staff/target contact', function () {
        beforeEach(function () {
          sortedDocumentList = _.sortBy($scope.list, function (doc) {
            return $rootScope.cache.contact.obj[doc.target_contact_id[0]].sort_name;
          });

          $scope.sortBy('target_contact');
        });

        it('lists documents by target contact/staff ', function () {
          expect($scope.list).toEqual(sortedDocumentList);
        });
      });

      describe('documents are sorted by assignees', function () {
        beforeEach(function () {
          sortedDocumentList = _.sortBy($scope.list, function (doc) {
            var assignee = doc.assignee_contact_id.length && _.find($rootScope.cache.contact.obj, {'id': doc.assignee_contact_id[0]});

            return assignee && assignee.sort_name;
          });
          $scope.sortBy('assignee');
        });

        afterEach(function () {
          $rootScope.$apply();
        });

        it('lists documents by assignees', function () {
          expect($scope.list).toEqual(sortedDocumentList);
        });
      });

      describe('documents are sorted by assignment type', function () {
        beforeEach(function () {
          sortedDocumentList = _.sortBy($scope.list, function (doc) {
            var assignment = $rootScope.cache.assignment.obj[doc.case_id];
            var assignmentType = assignment && $rootScope.cache.assignmentType.obj[assignment.case_type_id];

            return assignmentType && assignmentType.title;
          });

          $scope.sortBy('case_id');
        });

        it('lists documents by assignment type', function () {
          expect($scope.list).toEqual(sortedDocumentList);
        });
      });
    });

    describe('listAssignees', function () {
      var assignees;
      var concatedAssignees = {};

      beforeEach(function () {
        initController();

        _.each(contactFabricator.list(), function (option) {
          $rootScope.cache.contact.obj[option.contact_id] = option;
        });

        concatedAssignees[contactFabricator.list()[0].contact_id] = contactFabricator.list()[0].sort_name.replace(',', '');
        concatedAssignees[contactFabricator.list()[1].contact_id] = contactFabricator.list()[1].sort_name.replace(',', '');
        concatedAssignees[contactFabricator.list()[2].contact_id] = contactFabricator.list()[2].sort_name.replace(',', '');
        assignees = $scope.listAssignees(['202', '203', '204']);
      });

      afterEach(function () {
        $rootScope.$apply();
      });

      it('concats the list of assignes by comma', function () {
        expect(assignees).toEqual(concatedAssignees);
      });
    });

    function initController (scopeValues) {
      $controller('DocumentListCtrl', {
        $scope: $scope,
        config: config,
        documentList: documentFabricator.list()
      });
    }
  });
});
