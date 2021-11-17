import {
    shallowMount, mount, createLocalVue
} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import flushPromises from 'flush-promises';
import IngestArchivalMaterialMetadataForm from '@/job/ingest-archival-material/IngestArchivalMaterialMetadataForm.vue';
import {
    StagingNode,
    StagingDirectoryContents,
    getStagingFiles
} from '@/staging/StagingClient';
import {
    getAtomRecord
} from '@/util/AtomClient';

const mockStagingTree: StagingDirectoryContents = {
    '.info': {
        name: '.info',
        type: 'conf'
    },
    'test.tif': {
        name: 'test.tif',
        type: 'file'
    },
    'test2.tiff': {
        name: 'test2.tiff',
        type: 'file'
    }
};

const mockDeepStagingTree: StagingDirectoryContents = {
    tif: {
        name: 'tif',
        type: 'folder',
        contents: {
            'test.tif': {
                name: 'test.tif',
                type: 'file'
            },
            'test2.tiff': {
                name: 'test2.tiff',
                type: 'file'
            }
        }
    }
};

const aPdf: StagingNode = {
    name: 'test3.pdf',
    type: 'file'
};

jest.mock('@/staging/StagingClient', () => ({
    ...jest.requireActual('@/staging/StagingClient'),
    getStagingFiles: jest.fn()
}));

jest.mock('@/util/AtomClient', () => ({
    ...jest.requireActual('@/util/AtomClient'),
    getAtomRecord: jest.fn()
}));

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(Vuex);

describe('IngestArchiveMetadataForm', () => {
    let wrapper: any;
    let store: any;

    beforeEach(() => {
        store = new Store({});
    });

    it('renders', () => {
        (getStagingFiles as jest.Mock).mockImplementation(() => Promise.resolve(mockStagingTree));
        wrapper = shallowMount(IngestArchivalMaterialMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/'],
                defaultCopyright: 'DAI'
            }
        });
        expect(wrapper.exists()).toBeTruthy();
    });

    it('has no error alert', async() => {
        (getStagingFiles as jest.Mock).mockImplementation(
            () => Promise.resolve(mockStagingTree)
        );
        (getAtomRecord as jest.Mock).mockImplementation(target => Promise.resolve({
            id: 'de-001149881',
            reference_code: 'reference',
            title: 'Das Haus vom Nikolaus',
            dates: [
                {
                    date: '21.12.2112',
                    start_date: '20.12.2112',
                    end_date: '22.12.2112',
                    type: 'dummy'
                }],
            level_of_description: 'richtig hohes level',
            extent_and_medium: 'maximum',
            repository: 'archive',
            repository_inherited_from: 'archive-rom',
            scope_and_content: 'briefe',
            notes: ['eine Anmerkung']
        }));

        wrapper = mount(IngestArchivalMaterialMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/RECORD-AID-D-001149881'],
                defaultCopyright: 'DAI'
            }
        });
        expect(wrapper.exists()).toBeTruthy();
        await flushPromises();

        const icon = wrapper.find('.has-text-danger');
        expect(icon.exists()).toBe(false);

        // no error sign, check the output for extra safety
        wrapper.find('a').trigger('click');
        await wrapper.vm.$nextTick();
        const details = wrapper.find('.metadata_output');
        expect(details.text()).toContain('atom_id: de-001149881');
        expect(details.text()).toContain('copyright: DAI');
    });

    it('check clean tif subfolder', async() => {
        if (mockDeepStagingTree.tif.contents !== undefined) {
            mockDeepStagingTree.tif.contents['test3.pdf'] = aPdf;
        }
        (getStagingFiles as jest.Mock).mockImplementation(
            () => Promise.resolve(mockDeepStagingTree)
        );

        wrapper = mount(IngestArchivalMaterialMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/RECORD-AID-D-001149881'],
                defaultCopyright: 'DAI'
            }
        });
        await flushPromises();
        // click the expand arrow
        wrapper.find('a').trigger('click');
        // wait for event processing
        await flushPromises();
        // find the error message
        const details = wrapper.find('.metadata_output');
        expect(details.text()).toBe(
            "Subfolder 'tif' does not exclusively contain TIF files."
        );
    });

    it('check clean main folder', async() => {
        mockStagingTree['test3.pdf'] = aPdf;

        (getStagingFiles as jest.Mock).mockImplementation(() => Promise.resolve(mockStagingTree));

        wrapper = mount(IngestArchivalMaterialMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/RECORD-AID-D-001149881'],
                defaultCopyright: 'DAI'
            }
        });
        await flushPromises();
        // click the expand arrow
        wrapper.find('a').trigger('click');
        // wait for event processing
        await flushPromises();
        // await wrapper.vm.$nextTick();
        // find the error message
        const details = wrapper.find('.metadata_output');
        expect(details.text()).toBe(
            "Selected folder neither contains subfolder 'tif', nor itself exclusively TIF files."
        );
    });

    it('should act properly in a promise-returning test', async() => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        expect('a').toEqual('a');
    });
});
