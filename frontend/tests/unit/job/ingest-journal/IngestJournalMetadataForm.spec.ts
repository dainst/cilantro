import {
    shallowMount, mount, createLocalVue
} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import flushPromises from 'flush-promises';
import IngestJournalMetadataForm from '@/job/ingest-journal/IngestJournalMetadataForm.vue';
import { WorkbenchFileTree } from '@/staging/StagingClient';

let mockStagingTree: WorkbenchFileTree = {
};

jest.mock('@/staging/StagingClient', () => ({
    ...jest.requireActual('@/staging/StagingClient'),
    getStagingFiles: () => Promise.resolve(mockStagingTree)
}));

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(Vuex);

describe('IngestJournalMetadataForm', () => {
    let wrapper: any;
    let store: any;

    beforeEach(() => {
        store = new Store({});
        mockStagingTree = {
            tif: {
                name: 'tif',
                type: 'folder',
                contents: {
                    '.info': {
                        name: '.info',
                        type: 'conf'
                    },
                    'test.tif': {
                        name: 'test.tif',
                        type: 'tif'
                    },
                    'test2.tiff': {
                        name: 'test2.tiff',
                        type: 'tif'
                    }
                }
            }
        };
    });

    it('renders', () => {
        wrapper = shallowMount(IngestJournalMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/']
            }
        });
        expect(wrapper.exists()).toBeTruthy();
    });

    it('has no error alert', async() => {
        wrapper = mount(IngestJournalMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/Journal-ZID001149881']
            }
        });
        await flushPromises();

        // TODO: Find a way to wait for 'update:targetsUpdated' instead of just waiting 2000ms.
        await new Promise(resolve => setTimeout(resolve, 2000));

        expect(wrapper.emitted()).toHaveProperty('update:targetsUpdated');
        const icon = wrapper.find('.has-text-danger');
        expect(icon.exists()).toBe(false);
        // no error lets check the output
        wrapper.find('td.chevron-cell > a').trigger('click');

        await wrapper.vm.$nextTick();
        const details = wrapper.find('div.field > a');

        expect(details.text()).toBe('View in Zenon');
        expect(details.attributes().href).toBe('https://zenon.dainst.org/Record/001149881');
    });

    it('detect empty target folder', async() => {
        delete mockStagingTree.tif;

        wrapper = mount(IngestJournalMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/Journal-ZID001149881']
            }
        });
        await flushPromises();
        const icon = wrapper.find('.has-text-danger');
        expect(icon.exists()).toBe(true);
        // no error lets check the output
        wrapper.find('a').trigger('click');
        // wait for event processing
        await wrapper.vm.$nextTick();
        // find the error message
        const details = wrapper.find('.detail-container');
        expect(details.text()).toBe(
            'Could not find file at /Journal-ZID001149881.'
        );
    });

    it('detect missing tif folder', async() => {
        mockStagingTree = {
            '.info': {
                name: '.info',
                type: 'conf'
            },
            'test.tif': {
                name: 'test.tif',
                type: 'tif'
            },
            'test2.tiff': {
                name: 'test2.tiff',
                type: 'tif'
            }
        };

        wrapper = mount(IngestJournalMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/Journal-ZID001149881']
            }
        });
        await flushPromises();
        const icon = wrapper.find('.has-text-danger');
        expect(icon.exists()).toBe(true);
        // no error lets check the output
        wrapper.find('a').trigger('click');
        // wait for event processing
        await wrapper.vm.$nextTick();
        // find the error message
        const details = wrapper.find('.detail-container');
        expect(details.text()).toBe(
            "No Subfolder 'tif' found."
        );
    });

    it('detect invalid file in tif folder', async() => {
        if (mockStagingTree.tif.contents !== undefined) {
            mockStagingTree.tif.contents['wrong.pdf'] = {
                name: 'wrong.pdf',
                type: 'pdf'
            };
        }

        wrapper = mount(IngestJournalMetadataForm, {
            localVue,
            store,
            propsData: {
                selectedPaths: ['/Journal-ZID001149881']
            }
        });
        await flushPromises();
        const icon = wrapper.find('.has-text-danger');
        expect(icon.exists()).toBe(true);
        // no error lets check the output
        wrapper.find('a').trigger('click');
        // wait for event processing
        await wrapper.vm.$nextTick();
        // find the error message
        const details = wrapper.find('.detail-container');
        expect(details.text()).toBe(
            "Subfolder 'tif' does not exclusively contain TIF files."
        );
    });
});
