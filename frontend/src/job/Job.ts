export interface Job {
    created: string;
    errors: object[]; // TODO proper error interface
    job_id: string; // eslint-disable-line camelcase
    job_type: string; // eslint-disable-line camelcase
    name: string;
    params: object;
    state: string;
    updated: string;
    user: string;
}
