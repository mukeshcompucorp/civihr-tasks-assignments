define(['controllers/controllers',
        'services/file'], function(controllers){
    controllers.controller('ModalProgressCtrl',['$scope','$modalInstance', '$q', '$timeout', 'uploader',
        'entityId', 'FileService', '$log',
        function($scope, $modalInstance, $q, $timeout, uploader, entityId, FileService, $log){
            $log.debug('Controller: ModalProgressCtrl');

            $scope.uploader = uploader;

                if (uploader.queue.length) {
                    uploader.item = uploader.queue[0].file.name;
                }

                uploader.onProgressItem = function(item){
                    this.item = item.file.name;
                };

                uploader.onProgressAll = function(progress){
                    console.log(progress);
                };

            FileService.upload(uploader, entityId).then(function(results){
                $timeout(function(){
                    $modalInstance.close(results);
                },500);
            });

            $scope.cancel = function () {
                $modalInstance.dismiss('File upload canceled');
            };

        }]);
});