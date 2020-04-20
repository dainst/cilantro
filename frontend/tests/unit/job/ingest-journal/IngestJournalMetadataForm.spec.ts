import {shallowMount, mount, createLocalVue, Wrapper} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex';
import flushPromises from 'flush-promises';
import IngestJournalMetadataForm from '@/job/ingest-journal/IngestJournalMetadataForm.vue'
import { WorkbenchFile, WorkbenchFileTree, getVisibleFolderContents as realFolderFunction } from '@/staging/StagingClient';

let mockTif: WorkbenchFile = {
    name: 'test.tif',
    type: 'tif',
    marked: false,
};

let mockInfo: WorkbenchFile = {
    name: '.info',
    type: 'conf',
    marked: false,
}

let mockTiffFolder: WorkbenchFile = {
    name: 'tif',
    type: 'folder',
    marked: false,
    contents: {'test.tif': mockTif }
}

let mockFolder: WorkbenchFile = {
    name: 'tif',
    type: 'folder',
    marked: false,
    contents: { 'tif': mockTiffFolder, '.info': mockInfo }
};


jest.mock('@/staging/StagingClient', () => ({
    ...jest.requireActual('@/staging/StagingClient'),
    getStagingFiles: () => Promise.resolve({ 'Journal-ZID001149881': mockFolder }),
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


    it("has no error alert", async () =>{
        wrapper = mount(IngestJournalMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/Journal-ZID001149881']
            },
        })
        await flushPromises();
        let icon = wrapper.find('.has-text-danger');
        expect(icon.exists()).toBe(false);
    })
});