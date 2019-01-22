angular
    .module("module.jobs", [])
    .factory("jobs", ['$rootScope', 'webservice', function($rootScope, webservice) {
        const jobs = {};

        jobs.list = {};

        jobs.updateJob = (job) => {
            jobs.list[job.job_id] = {
                statusText: 'unknown',
                status: 0,
                job_id: job.job_id,
                created: job.created,
                errors: job.errors,
                job_type: job.job_type,
                params: job.params,
                state: job.state,
                task_ids: job.task_ids,
                updated: job.updated,
                user: job.user,
                should_collapse: true
            };

            if (!job.errors.length) {
                jobs.list[job.job_id].statusText = job.state;
                jobs.list[job.job_id].status = job.state === "success" ? 1 : 0;
            } else {
                jobs.list[job.job_id].statusText = 'Error';
                jobs.list[job.job_id].status = -1;
            }

            //TODO determine correct way to filter jobs (frontend)
            updated = new Date(job.updated);
            now = Date.now();
            if((now-updated)>10000000){
                jobs.list[job.job_id].should_collapse=false;
            }

            $rootScope.$digest();
        };

        jobs.refresh = () => {
            webservice.get('job/jobs').then(result => result.forEach(job => jobs.updateJob(job)))
                .catch(err => console.log(err));
        };

        return jobs;
    }]);
