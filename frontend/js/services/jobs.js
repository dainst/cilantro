angular
    .module("module.jobs", [])
    .factory("jobs", ['$rootScope', 'webservice', function($rootScope, webservice) {
        const jobs = {};

        jobs.list = {};
        jobs.tasks = {};

        jobs.updateJob = (jobId, job, isError) => {

            if (angular.isUndefined(jobs.list[jobId])) {
                jobs.list[jobId] = {
                    statusText: 'unknown',
                    status: 0,
                    task_ids: [],
                    job_id: jobId
                }
            }

            // becaus /job/<jobid>- endpoint gives not back tasj-ids for some reason
            if (!angular.isUndefined(job.task_ids)) {
                jobs.list[jobId].task_ids = job.task_ids;
            }

            if (!isError) {
                jobs.list[jobId].statusText = job.status;
                jobs.list[jobId].status = job.status === "SUCCESS" ? 1 : 0;
            } else {
                jobs.list[jobId].statusText = 'Error';
                jobs.list[jobId].status = -1;
            }
            jobs.refreshTasks(jobId);
        };

        jobs.refresh = () => {
            Object.values(jobs.list).forEach(job => webservice.get('job/' + job.job_id)
                .then(result => jobs.updateJob(job.job_id, result))
                .catch(err => jobs.updateJob(job.job_id, err, true))
            );
        };

        jobs.refreshTasks = jobId => {
            console.log(jobs.list);
            Object.values(jobs.list[jobId].task_ids).forEach(taskId => {
                if (angular.isUndefined(jobs.tasks[jobId])) {
                    jobs.tasks[taskId] = {
                        statusText: 'unknown',
                        status: 0
                    };
                }
                webservice.get('job/' + taskId)
                    .then(result => {
                        jobs.tasks[taskId].statusText = result.status;
                        jobs.tasks[taskId].status = result.status === "SUCCESS" ? 1 : 0;
                        $rootScope.$broadcast('refreshView');
                    })
                    .catch(err => {
                        jobs.tasks[taskId].statusText = 'error';
                        jobs.tasks[taskId].status = -1;
                        $rootScope.$broadcast('refreshView');
                    });
            });
        };



        return jobs;
    }]);