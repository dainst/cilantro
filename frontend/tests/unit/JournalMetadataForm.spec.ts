import { mount, createLocalVue } from '@vue/test-utils';
import Buefy from 'buefy';
import JournalMetadataForm from '@/job/ingest-journal/forms/JournalMetadataForm.vue';
import { JournalMetadata } from '@/job/ingest-journal/JournalImportParameters';

const localVue = createLocalVue();
localVue.use(Buefy);

describe('JournalMetadataForm.vue', () => {
    const journalMetadata: JournalMetadata = {
        volume: '',
        year: 2018,
        number: '',
        description: '[PDFs teilweise verf\u00fcgbar]',
        identification: 'year'
    };
    const wrapper = mount(JournalMetadataForm, {
        localVue,
        propsData: { metadata: journalMetadata }
    });

    it('renders input element', () => {
        const el = wrapper.find('input');
        expect(el.is('input')).toBe(true);
    });
});
