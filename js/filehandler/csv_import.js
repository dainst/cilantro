let mod = angular.module('module.fileHandlers.csv_import', ['ui.bootstrap']);

mod.factory("csv_import", ['$rootScope', '$uibModal', 'editables', 'file_manager', 'dataset', 'messenger',
    function($rootScope, $uibModal, editables, file_manager, dataset, messenger) {

        const csvHandler = new file_manager.FileHandler('csv_import');

        csvHandler.description = "Create Articles with metadata from a CSV-file";
        csvHandler.fileTypes = ["csv"];

        csvHandler.handleFile = file => file_manager.loadFileContents(file).then(files => files.forEach(csvImport));

        function csvImport(file) {

            const modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/modals/csv-import.html',
                controller: "csv_import_window",
                controllerAs: '$ctrl',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {'file': () => file}
            });

            modalInstance.result.then(function(filled_columns) {
                csvHandler.columns = filled_columns;
                for (let i = 0, ids = Object.keys(dataset.articles); i < ids.length; i++) {
                    $rootScope.$broadcast('thumbnaildataChanged', dataset.articles[ids[i]]);
                }
                csvHandler.ready = true;
            }, function(a) {
                csvHandler.ready = true;
            });

        }

        return csvHandler

    }])
.run(function(csv_import) {csv_import.register()});

