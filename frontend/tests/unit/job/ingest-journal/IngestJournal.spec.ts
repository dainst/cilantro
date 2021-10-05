import {
    shallowMount, mount, createLocalVue, Wrapper
} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import IngestJournal from '@/job/ingest-journal/IngestJournal.vue';

import JobFilesForm from '@/job/JobFilesForm.vue';
import JournalMetadataForm from '@/job/ingest-journal/IngestJournalMetadataForm.vue';
import JournalOptionsForm from '@/job/ingest-journal/IngestJournalOptionsForm.vue';
import AppOptionsForm from '@/job/AppOptionsForm.vue';
import {
    IngestJournalParameters, JournalIssueMetadata, IngestJournalOptions, JobTargetData
} from '@/job/ingest-journal/IngestJournalParameters';

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(Vuex);

// create test data
const fakePath = './haus/vom/nikolaus/';
const target = new JobTargetData('007', fakePath, new JournalIssueMetadata('0023456'));
const options: IngestJournalOptions = {
    ojs_options: { default_create_frontpage: true },
    ocr_options: {
        do_ocr: true,
        ocr_lang: ''
    },
    app_options: { mark_done: true }
};
const param = new IngestJournalParameters([target], options);

describe('IngestJournal.vue', () => {
    let wrapper: any;

    beforeEach(() => {
        const store = new Store({});
        wrapper = shallowMount(IngestJournal, {
            localVue,
            store,
            data() {
                return {
                    parameters: param,
                    selectedPaths: [fakePath]
                };
            }
        });
    });

    it('has a job files form', () => {
        expect(wrapper.findComponent(JobFilesForm).exists()).toBe(true);
    });

    it('has a journal metadata form', async() => {
        const button = wrapper.find('.toMetadataButton');
        button.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(JournalMetadataForm).exists()).toBe(true);
    });

    it('has a journal options form and a app options form', async() => {
        // emulating user click path
        // first to metadata
        let button = wrapper.find('.toMetadataButton');
        button.vm.$emit('click');
        await wrapper.vm.$nextTick();

        // then to the options
        button = wrapper.find('.toOptionsButton');
        button.vm.$emit('click');
        await wrapper.vm.$nextTick();

        // now check for the correct forms
        expect(wrapper.findComponent(JournalOptionsForm).exists()).toBe(true);
        expect(wrapper.findComponent(AppOptionsForm).exists()).toBe(true);
    });
});
