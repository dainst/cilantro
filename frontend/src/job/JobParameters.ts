export interface JobObject {
    path: string;
}

export interface JobParameters {
    objects: JobObject[];
    options: object;
}
