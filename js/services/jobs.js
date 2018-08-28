angular
    .module("module.jobs", [])
    .factory("jobs", [function() {
        const jobs = {};

        jobs.list = {};

        return jobs;
    }]);