export interface Job {
    children: object[];
    created: string;
    duration:string;
    errors: object[]; // TODO proper error interface
    job_id: string; // eslint-disable-line camelcase
    job_type: string; // eslint-disable-line camelcase
    name: string;
    parameters: object;
    parent_job_id:string;
    started:string;
    state: string;
    updated: string;
    user: string;
}
