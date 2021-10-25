import {
    shallowMount, mount, createLocalVue, Wrapper
} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import IngestArchivalMaterial from '@/job/ingest-archival-material/IngestArchivalMaterial.vue';

import JobFilesForm from '@/job/JobFilesForm.vue';
import IngestArchivalMaterialMetadataForm from '@/job/ingest-archival-material/IngestArchivalMaterialMetadataForm.vue';
import OCROptionsForm from '@/job/OCROptionsForm.vue';

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(Vuex);

// create test data
const fakePath = './haus/vom/nikolaus/';

describe('IngestArchivalMaterial.vue', () => {
    let wrapper: any;

    beforeEach(() => {
        const store = new Store({});
        wrapper = shallowMount(IngestArchivalMaterial, {
            localVue,
            store,
            data() {
                return {
                    selectedPaths: fakePath
                };
            }
        });
    });

    it('has a job files form', () => {
        expect(wrapper.findComponent(JobFilesForm).exists()).toBe(true);
    });

    it('has a archival metadata form', async() => {
        const button = wrapper.find('.toMetadataButton');
        button.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(IngestArchivalMaterialMetadataForm).exists()).toBe(true);
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
        expect(wrapper.findComponent(OCROptionsForm).exists()).toBe(true);
    });
});
