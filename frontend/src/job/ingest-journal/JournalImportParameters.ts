/* eslint-disable camelcase */

export interface JournalMetadata {
    volume: string;
    year: number;
    number: string;
    description: string;
    identification: string;
}

export interface OJSMetadata {
    ojs_journal_code: string;
    ojs_user: string;
    auto_publish_issue: boolean;
    default_publish_articles: boolean;
    default_create_frontpage: boolean;
    allow_upload_without_file: boolean;
}

export interface FileRange {
    file: string;
    range: number[];
}

export interface Author {
    firstname: string;
    lastname: string;
}

export interface Pages {
    showndesc: string;
    startPrint: number;
    endPrint: number;
}

export interface ArticleMetadata {
    title: string;
    author: Author[];
    pages: Pages;
    date_published: string;
    language: string;
    zenonId: string;
    auto_publish: boolean;
    create_frontpage: boolean;
}

export interface Part {
    metadata: ArticleMetadata;
    files: FileRange[];
}

export interface NLPParams {
    lang: string;
}

export interface JournalImportParameters {
    metadata: JournalMetadata;
    files: FileRange[];
    parts: Part[];
    ojs_metadata: OJSMetadata;
    do_ocr: boolean;
    keep_ratio: boolean;
    nlp_params: NLPParams;
}
