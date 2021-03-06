define([
    'tasks-assignments/filters/filters'
], function (filters) {
    'use strict';

    filters.filter('filterByContactId',['$filter', 'config', '$log', function ($filter, config, $log) {
        $log.debug('Filter: filterByContactId');

        return function(inputArr, contactId) {
            var filteredArr = [],
                i = 0,
                inputArrlen = inputArr.length;

            if (!inputArrlen || !contactId || typeof +contactId !== 'number') {
                return inputArr;
            }

            for (i; i < inputArrlen; i++) {

                if (+inputArr[i].assignee_contact_id[0] === +contactId ||
                    +inputArr[i].source_contact_id === +contactId ||
                    +inputArr[i].target_contact_id === +contactId) {
                    filteredArr.push(inputArr[i]);
                }
            }
            return filteredArr;

        }
    }]);

});
