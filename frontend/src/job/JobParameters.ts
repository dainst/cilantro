export interface JobObject {
    id: string;
    path: string;
}

export interface JobParameters {
    objects: JobObject[];
    options: object;
}
