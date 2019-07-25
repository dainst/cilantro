
class JournalMetadata {
    volume: string = '';
    year: number = 2018;
    number: string = '';
    description: string = '[PDFs teilweise verf\u00fcgbar]';
    identification: string = 'year';
}

class OJSMetadata {
    /* eslint-disable camelcase */
    ojs_journal_code: string = 'test';
    ojs_user: string = 'ojs_user';
    auto_publish_issue: boolean = true;
    default_publish_articles: boolean = true;
    default_create_frontpage: boolean = true;
    allow_upload_without_file: boolean = false;
}

class FileRange {
    file: String = 'test.pdf';
    range: number[] = [1, 5];
}

class Author {
    firstname: string = '';
    lastname: string = '';

    constructor(firstname:string, lastname:string) {
        this.firstname = firstname;
        this.lastname = lastname;
    }
}

class Pages {
    showndesc: string = '21\u201327';
    startPrint: number = 21;
    endPrint: number = 23;
}

class ArticleMetadata {
    title: string = 'Titel 2';
    author: Author = new Author('Autor', 'dererste');
    pasges: Pages = new Pages();
    date_published: string = '2018--';
    language: string = 'de_DE';
    zenonId: string = '';
    auto_publish: boolean = true;
    create_frontpage: boolean = true;
}

class Part {
    metadata: ArticleMetadata = new ArticleMetadata();
    files: FileRange = new FileRange();
}

class NLPParams {
    lang: string = 'deu';
}

export default class JobConfig {
    metadata: JournalMetadata = new JournalMetadata();
    files: FileRange[] = [new FileRange()];
    parts: Part[] = [];
    ojs_metadata: OJSMetadata = new OJSMetadata();
    do_ocr: boolean = false;
    keep_ratio: boolean = true;
    nlp_params: NLPParams = new NLPParams();
}
