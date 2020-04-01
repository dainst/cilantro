import {shallowMount, mount, createLocalVue, Wrapper} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex';
import flushPromises from 'flush-promises';
import IngestJournalMetadataForm from '@/job/ingest-journal/IngestJournalMetadataForm.vue'
import { WorkbenchFile, WorkbenchFileTree, getVisibleFolderContents as realFolderFunction } from '@/staging/StagingClient';

let mockBench: WorkbenchFile = {
    name: 'test',
    type: 'tif',
};

let mockFolder: WorkbenchFile = {
    name: 'tif',
    type: 'folder',
    contents: {'001': mockBench}
};


jest.mock('@/staging/StagingClient', () => ({
    getStagingFiles: () => Promise.resolve({ 'Journal-ZID001149881': mockFolder }),
    getVisibleFolderContents: (tree: WorkbenchFileTree) => tree
}));


const localVue = createLocalVue();
localVue.use(Buefy)
localVue.use(Vuex)

describe("IngestJournalMetadataForm", () => {
    let wrapper: any;
    let store: any;

    beforeEach(() => {
        store = new Store({});
        
    });

    it("renders", () => {
        wrapper = shallowMount(IngestJournalMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/']
            }
        })
        expect(wrapper.exists()).toBeTruthy()
    });


    it("has a proper selectedPaths", async () =>{
        wrapper = shallowMount(IngestJournalMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/Journal-ZID001149881']
            }
        })
        await flushPromises();
        expect(true).not.toBeFalsy();
    })
});