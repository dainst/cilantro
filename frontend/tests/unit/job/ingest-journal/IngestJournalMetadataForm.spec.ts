import {
    shallowMount, mount, createLocalVue
} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import flushPromises from 'flush-promises';
import IngestJournalMetadataForm from '@/job/ingest-journal/IngestJournalMetadataForm.vue';
import { WorkbenchFileTree } from '@/staging/StagingClient';

import stagingTreeMock from '@/../tests/resources/ingest-journal/staging-tree-mock.json';

jest.mock('@/staging/StagingClient', () => ({
    ...jest.requireActual('@/staging/StagingClient'),
    getStagingFiles: () => Promise.resolve(stagingTreeMock)
}));

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(Vuex);

describe('IngestJournalMetadataForm', () => {
    let wrapper: any;
    let store: any;

    beforeEach(() => {
        store = new Store({});
        wrapper = shallowMount(IngestJournalMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: []
            }
        });
    });

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('valid directories produce no errors', () => {
        const result = wrapper.vm.evaluateTargetFolder(stagingTreeMock['JOURNAL-ZID001108201'].contents);
        expect(result).toHaveLength(0);
    });

    it('empty target directory produces errors', () => {
        const result = wrapper.vm.evaluateTargetFolder({});

        expect(result).toContain('Folder appears to be empty. Please provide input data.');
    });

    it('missing tif directory in target directory produces error', () => {
        const copy = (JSON.parse(JSON.stringify(stagingTreeMock['JOURNAL-ZID001108201'].contents)));

        delete copy.tif;
        const result = wrapper.vm.evaluateTargetFolder(copy);

        expect(result).toContain("No Subfolder 'tif' found.");
    });

    it('different file type in tif directory produces error', () => {
        const copy = (JSON.parse(JSON.stringify(stagingTreeMock['JOURNAL-ZID001108201'].contents)));

        copy.tif.contents['JOURNAL-ZID001364448-0002.jpg'] = {
            name: 'JOURNAL-ZID001364448-0002.jpg',
            type: 'file'
        };

        const result = wrapper.vm.evaluateTargetFolder(copy);
        expect(result).toContain("Subfolder 'tif' does not exclusively contain TIF files.");
    });
});
