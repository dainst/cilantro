import { mount, createLocalVue } from '@vue/test-utils';
import Buefy from 'buefy';
import ArticleMetadataForm from '@/job/ingest-journal/forms/ArticleMetadataForm.vue';
import {
    Part, FileRange, ArticleMetadata, Author, Pages
} from '@/job/ingest-journal/JobParameters.ts';

const localVue = createLocalVue();
localVue.use(Buefy);

describe('ArticleMetadataForm.vue', () => {
    const article: Part = createExampleArticle();
    const availableFiles: FileRange[] = [];
    const wrapper = mount(ArticleMetadataForm, {
        localVue,
        propsData: {
            initialData: article,
            availableFiles
        }
    });

    it('renders input element', () => {
        const el = wrapper.find('input');
        expect(el.is('input')).toBe(true);
    });
});

function createExampleArticle() {
    const pages = {
        showndesc: '',
        startPrint: 1,
        endPrint: 2
    } as Pages;

    const author = {
        firstname: '',
        lastname: ''
    } as Author;

    const metadata = {
        title: 'test-title',
        abstract: '',
        author,
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
