import {
    shallowMount, mount, createLocalVue
} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import flushPromises from 'flush-promises';
import IngestArchivalMaterialMetadataForm from '@/job/ingest-archival-material/IngestArchivalMaterialMetadataForm.vue';
import {
    WorkbenchFile,
    WorkbenchFileTree,
    getStagingFiles
} from '@/staging/StagingClient';

const mockStagingTree: WorkbenchFileTree = {
    'RECORD-AID-D-001149881': {
        name: 'RECORD-AID-D-001149881',
        type: 'folder',
        marked: false,
        contents: {
            '.info': {
                name: '.info',
                type: 'conf',
                marked: false
            },
            'test.tif': {
                name: 'test.tif',
                type: 'file',
                marked: false
            },
            'test2.tiff': {
                name: 'test2.tiff',
                type: 'file',
                marked: false
            }
        }
    }
};

const mockDeepStagingTree: WorkbenchFileTree = {
    'RECORD-AID-D-001149881': {
        name: 'RECORD-AID-D-001149881',
        type: 'folder',
        marked: false,
        contents: {
            tif: {
                name: 'tif',
                type: 'folder',
                marked: false,
                contents: {
                    'test.tif': {
                        name: 'test.tif',
                        type: 'file',
                        marked: false
                    },
                    'test2.tiff': {
                        name: 'test2.tiff',
                        type: 'file',
                        marked: false
                    }
                }
            }
        }
    }
};

const aPdf: WorkbenchFile = {
    name: 'test3.pdf',
    type: 'file',
    marked: false
};

jest.mock('@/staging/StagingClient', () => ({
    ...jest.requireActual('@/staging/StagingClient'),
    getStagingFiles: jest.fn()
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
        wrapper = mount(IngestArchivalMaterialMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/RECORD-AID-D-001149881'],
                defaultCopyright: 'DAI'
            }
        });
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
        if (mockDeepStagingTree['RECORD-AID-D-001149881'].contents !== undefined &&
            mockDeepStagingTree['RECORD-AID-D-001149881'].contents.tif.contents !== undefined) {
            mockDeepStagingTree['RECORD-AID-D-001149881'].contents.tif.contents['test3.pdf'] = aPdf;
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
        await wrapper.vm.$nextTick();
        // find the error message
        const details = wrapper.find('.metadata_output');
        expect(details.text()).toBe(
            "Subfolder 'tif' does not exclusively contain TIF files."
        );
    });

    it('check clean main folder', async() => {
        if (mockStagingTree['RECORD-AID-D-001149881'].contents !== undefined) {
            mockStagingTree['RECORD-AID-D-001149881'].contents['test3.pdf'] = aPdf;
        }

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
        await wrapper.vm.$nextTick();
        // find the error message
        const details = wrapper.find('.metadata_output');
        expect(details.text()).toBe(
            "Selected folder neither contains subfolder 'tif', nor itself exclusively TIF files."
        );
    });
});
