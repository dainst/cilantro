/* eslint-disable camelcase */

export interface BookMetadata {
    title: string;
    abstract: string;
    description: string;
    type: string;
    created: string;
    author: Author[];
    identifiers: string[];
}

export interface FileParam {
    file: string;
}

export interface Author {
    firstname: string;
    lastname: string;
}

export interface BookPartMetadata {
    title: string;
}

export interface BookPart {
    metadata: BookPartMetadata;
    range: number[];
}

export interface BookImportParameters {
    object_id: string;
    metadata: BookMetadata;
    files: FileParam[];
    parts: BookPart[];
}
