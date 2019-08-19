import { mount, createLocalVue } from '@vue/test-utils';
import Buefy from 'buefy';
import ArticleDetailForm from '@/job/ingest-journal/forms/ArticleDetailForm.vue';
import {
    Part, FileRange, ArticleMetadata, Author, Pages
} from '@/job/ingest-journal/JournalImportParameters.ts';

const localVue = createLocalVue();
localVue.use(Buefy);

describe('ArticleDetailForm.vue', () => {
    const article: Part = createExampleArticle();
    const availableFiles: FileRange[] = [];
    const wrapper = mount(ArticleDetailForm, {
        localVue,
        propsData: {
            articleData: article,
            availableFiles
        }
    });

    it('renders input element', () => {
        expect(wrapper.find('input').is('input')).toBe(true);
    });
});

function createExampleArticle() {
    const pages = {
        showndesc: '',
        startPrint: 1,
        endPrint: 2
    } as Pages;

    const author = {
        firstname: 'author_first',
        lastname: 'author_last'
    } as Author;

    const metadata = {
        title: 'test-title',
        abstract: '',
        author: [author],
        pages,
        date_published: '',
        language: '',
        zenonId: '',
        auto_publish: true,
        create_frontpage: false
    } as ArticleMetadata;

    const files = {
        file: 'file dummy',
        range: [1, 3]
    } as FileRange;

    const part = {
        metadata,
        files: [files]
    } as Part;

    return part;
}
