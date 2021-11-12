import {
    mount, createLocalVue
} from '@vue/test-utils';
import Ajv from 'ajv';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import IngestMonograph from '@/job/ingest-monograph/IngestMonograph.vue';
import MonographMetadataForm from '@/job/ingest-monograph/IngestMonographMetadataForm.vue';

import jobSchema from '@/../../resources/job_parameter_schemas/ingest_monographs_schema.json';
import stagingTreeMock from '@/../tests/resources/ingest-monograph/staging-tree-mock.json';
import JobFilesForm from '@/job/JobFilesForm.vue';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';

import {
    getStagingFiles
} from '@/staging/StagingClient';

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(Vuex);

const ajv = new Ajv();

const validate = ajv.compile(jobSchema);

jest.mock('@/staging/StagingClient', () => ({
    ...jest.requireActual('@/staging/StagingClient'),
    getStagingFiles: jest.fn()
}));

describe('IngestMonograph.vue', () => {
    let wrapper: any;
    let startJobSpy: any;

    beforeEach(() => {
        (getStagingFiles as jest.Mock).mockImplementation(
            (path: string, _depths) => {
                if (path === 'BOOK-ZID000146815') return Promise.resolve(stagingTreeMock['BOOK-ZID000146815'].contents);
                if (path === 'BOOK-ZID000166554') return Promise.resolve(stagingTreeMock['BOOK-ZID000166554'].contents);
                return Promise.resolve(stagingTreeMock);
            }
        );

        const store = new Store({});

        wrapper = mount(IngestMonograph, {
            localVue,
            store
        });

        startJobSpy = jest.spyOn(wrapper.vm, 'startJob');
    });

    it('combined ingest-monograph steps starts job with valid parameters', async() => {
        expect(wrapper.findComponent(JobFilesForm).exists()).toBe(true);

        // Select all mocked directories
        await wrapper.find('thead label.checkbox > input').trigger('click');
        await wrapper.findComponent(ContinueButton).vm.onClick();

        expect(wrapper.findComponent(MonographMetadataForm).exists()).toBe(true);
        // Wait 4 seconds for the Zenon Queries to resolve.
        // Todo: Is there a better way than a hardcoded timeout?
        await new Promise(resolve => setTimeout(resolve, 4000));
        await wrapper.findComponent(ContinueButton).vm.onClick();

        await wrapper.findComponent(StartJobButton).vm.onClick();
        expect(startJobSpy).toHaveBeenCalled();
        expect(validate(wrapper.vm.parameters)).toBe(true);
    });
});
