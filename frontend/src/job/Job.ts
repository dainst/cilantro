export interface Job {
    created: string;
    errors: object[]; // TODO proper error interface
    job_id: string;
    job_type: string;
    name: string;
    params: object;
    state: string;
    updated: string;
    user: string;
}
