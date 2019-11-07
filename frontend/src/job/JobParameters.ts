export interface JobObject {
    id: string;
    path: string;
    metadata: object;
}

export interface JobParameters {
    objects: JobObject[];
    options: object;
}
