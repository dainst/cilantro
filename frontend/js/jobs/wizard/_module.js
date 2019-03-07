angular.module("workbench.jobs.wizard", [
        "ngFileUpload",
        "workbench.files",
        "workbench.zenon"
    ])

    .config(["$stateProvider", function($stateProvider) {
        $stateProvider
            .state({
                name: "jobs.wizard",
                url: "/wizard",
                templateUrl: "js/jobs/wizard/wizard.html",
            })
            .state({
                name: "jobs.wizard.start",
                url: "/start",
                templateUrl: "js/jobs/wizard/start.html",
            })
            .state({
                name: "jobs.wizard.documents",
                url: "/documents",
                templateUrl: "js/jobs/wizard/documents.html",
            })
            .state({
                name: "jobs.wizard.overview",
                url: "/overview",
                templateUrl: "js/jobs/wizard/overview.html",
            })
            .state({
                name: "jobs.wizard.subobjects",
                url: "/subobjects",
                templateUrl: "js/jobs/wizard/subobjects.html",
            })
            .state({
                name: "jobs.wizard.finish",
                url: "/finish",
                templateUrl: "js/jobs/wizard/finish.html",
            });
    }]);
