angular
    .module("module.jobs", [])
    .factory("jobs", ['$rootScope', 'webservice', function($rootScope, webservice) {
        const jobs = {};

        jobs.list = {};

        jobs.updateJob = (jobId, job, isError) => {

            if (angular.isUndefined(jobs.list[jobId])) {
                jobs.list[jobId] = {
                    statusText: 'unknown',
                    status: 0,
                    job_id: jobId
                }
            }

            if (!isError) {
                jobs.list[jobId].statusText = job.status;
                jobs.list[jobId].status = job.status === "SUCCESS" ? 1 : 0;
            } else {
                jobs.list[jobId].statusText = 'Error';
                jobs.list[jobId].status = -1;
            }
        };

        jobs.refresh = () => {
            Object.values(jobs.list).forEach(job => webservice.get('job/' + job.job_id)
                .then(result => jobs.updateJob(job.job_id, result))
                .catch(err => jobs.updateJob(job.job_id, err, true))
            );
        };

        return jobs;
    }]);
