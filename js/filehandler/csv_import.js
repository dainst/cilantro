const mod = angular.module('module.fileHandlers.csvImport', ['ui.bootstrap']);

mod.factory("csvImport", ['$rootScope', '$uibModal', 'editables', 'fileManager', 'dataset',
    function($rootScope, $uibModal, editables, fileManager, dataset) {

        const csvHandler = new fileManager.FileHandler('csv_import');

        csvHandler.description = "Create Articles with metadata from a CSV-file";
        csvHandler.fileTypes = ["csv"];

        /*Old version of .handleFile, can be removed if tests succeed*/
        //csvHandler.handleFile = file => fileManager.loadFileContents(file).then(files => files.forEach(csvImport));

        /*initiates csvImport-modal, either blank or with data from uploaded file*/
        csvHandler.handleFile = function(file){
            if(file === ""){
                return csvImport("");
            }
            else
                return fileManager.loadFileContents(file).then(files => files.forEach(csvImport));
        }

        function csvImport(file) {

            const modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/modals/csv_import.html',
                controller: "csvImportWindow",
                controllerAs: '$ctrl',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {'file': () => file}
            });

            modalInstance.result.then(function(filled_columns) {
                for (let i = 0, ids = Object.keys(dataset.subobjects); i < ids.length; i++) {
                    $rootScope.$broadcast('thumbnaildataChanged', dataset.subobjects[ids[i]]);
                }
                fileManager.ready = true;
            }, function(a) {
                fileManager.ready = true;
            });
        }

        return csvHandler

    }])
.run(function(csvImport) {csvImport.register()});

