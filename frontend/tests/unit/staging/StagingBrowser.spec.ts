import {
    shallowMount, mount, createLocalVue
} from '@vue/test-utils';

import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import flushPromises from 'flush-promises';

import StagingBrowser from '@/staging/StagingBrowser.vue';
import { WorkbenchFileTree, JobInfo, JobInfoStatus } from '@/staging/StagingClient';

const mockStagingTree: WorkbenchFileTree = {
    'BOOK-ZID001595386': {
        contents: { tif: { name: 'tif', type: 'directory' } }, name: 'BOOK-ZID001595386', type: 'directory'
    },
    'BOOK-ZID000146815': {
        contents: { '.cilantro_info': { name: '.cilantro_info', type: 'file' }, tif: { name: 'tif', type: 'directory' } }, job_info: { msg: 'Monograph imported successfully', status: JobInfoStatus.success }, name: 'BOOK-ZID000146815', type: 'directory'
    },
    'BOOK-ZID000166554': {
        contents: { '.cilantro_info': { name: '.cilantro_info', type: 'file' }, tif: { name: 'tif', type: 'directory' } }, job_info: { job_id: 'job_with_error', msg: '{ job_id: \'job_with_error\', job_name: \'convert.tif_to_pdf\', message: "name \'or_lang\' is not defined" }', status: JobInfoStatus.error }, name: 'BOOK-ZID000166554', type: 'directory'
    },
    'BOOK-ZID000166551': {
        contents: { '.cilantro_info': { name: '.cilantro_info', type: 'file' }, tif: { name: 'tif', type: 'directory' } }, job_info: { job_id: 'job_still_running', status: JobInfoStatus.started }, name: 'BOOK-ZID000166551', type: 'directory'
    }
};

jest.mock('@/staging/StagingClient', () => ({
    ...jest.requireActual('@/staging/StagingClient'),
    getStagingFiles: () => Promise.resolve(mockStagingTree)
}));

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(Vuex);

describe('StagingBrowser.vue', () => {
    let wrapper: any;

    beforeEach(async() => {
        wrapper = mount(StagingBrowser, {
            localVue,
            propsData: {
                selectedPaths: ['/']
            }
        });
    });

    it('renders', () => {
        wrapper = shallowMount(StagingBrowser, {
            localVue,
            propsData: {
                selectedPaths: ['/']
            }
        });
        expect(wrapper.exists()).toBeTruthy();
    });

    it('directories with a previously failed import attempt are marked and shown by default', async() => {
        await flushPromises();
        expect(wrapper.find('.has-text-danger i.mdi-folder').exists()).toBe(true);
        expect(wrapper.find('a[href="/job?id=job_with_error"]').exists()).toBe(true);
    });

    it('directories with a previously failed import show link to failed job', async() => {
        await flushPromises();
        expect(wrapper.find('a[href="/job?id=job_with_error"]').exists()).toBe(true);
    });

    it('directories with a previously failed import attempt can be hidden', async() => {
        await flushPromises();
        expect(wrapper.find('span.has-text-danger i.mdi-folder').exists()).toBe(true);
        await wrapper.find('#toggleFailed input').trigger('click');
        expect(wrapper.find('span.has-text-danger i.mdi-folder').exists()).toBe(false);
    });

    it('directories still being processed are marked', async() => {
        await flushPromises();
        expect(wrapper.find('.has-text-warning > i.mdi-folder').exists()).toBe(true);
    });

    it('directories still being processed show link to running job', async() => {
        await flushPromises();
        expect(wrapper.find('a[href="/job?id=job_still_running"]').exists()).toBe(true);
    });

    it('successfully imported directories are hidden by default', async() => {
        await flushPromises();
        expect(wrapper.find('.has-text-success > i.mdi-folder').exists()).toBe(false);
    });

    it('successfully imported directories can be displayed and are marked', async() => {
        await flushPromises();
        expect(wrapper.find('span.has-text-success i.mdi-folder').exists()).toBe(false);
        await wrapper.find('#toggleCompleted input').trigger('click');
        expect(wrapper.find('span.has-text-success i.mdi-folder').exists()).toBe(true);
    });
});
