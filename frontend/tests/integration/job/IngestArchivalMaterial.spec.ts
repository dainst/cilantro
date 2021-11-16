import {
    mount, createLocalVue
} from '@vue/test-utils';
import Ajv from 'ajv';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import IngestArchivalMaterial from '@/job/ingest-archival-material/IngestArchivalMaterial.vue';
import IngestArchivalMaterialMetadataForm from '@/job/ingest-archival-material/IngestArchivalMaterialMetadataForm.vue';

import jobSchema from '@/../../resources/job_parameter_schemas/ingest_archival_material_schema.json';
import atomDataMock from '@/../../test/wiremock_config/mappings/atom_get_record.json';
import stagingTreeMock from '@/../tests/resources/ingest-archival-material/staging-tree-mock.json';
import JobFilesForm from '@/job/JobFilesForm.vue';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';

import {
    getStagingFiles
} from '@/staging/StagingClient';
import { getAtomRecord } from '@/util/AtomClient';

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(Vuex);

const ajv = new Ajv();

const validate = ajv.compile(jobSchema);

jest.mock('@/staging/StagingClient', () => ({
    ...jest.requireActual('@/staging/StagingClient'),
    getStagingFiles: jest.fn()
}));

jest.mock('@/util/AtomClient', () => ({
    ...jest.requireActual('@/util/AtomClient'),
    getAtomRecord: jest.fn()
}));

describe('IngestArchivalMaterial.vue', () => {
    let wrapper: any;
    let startJobSpy: any;

    beforeEach(() => {
        (getStagingFiles as jest.Mock).mockImplementation(
            (path: string, _depths) => {
                if (path === 'RECORD-AID-D-de-dai-z-adz-nl-otto-benndorf_3') return Promise.resolve(stagingTreeMock['RECORD-AID-D-de-dai-z-adz-nl-otto-benndorf_3'].contents);
                if (path === 'RECORD-AID-D-de-dai-z-adz-nl-otto-benndorf_4') return Promise.resolve(stagingTreeMock['RECORD-AID-D-de-dai-z-adz-nl-otto-benndorf_4'].contents);
                return Promise.resolve(stagingTreeMock);
            }
        );

        (getAtomRecord as jest.Mock).mockImplementation(
            _atomId => Promise.resolve(JSON.parse(atomDataMock.response.body))
        );

        const store = new Store({});

        wrapper = mount(IngestArchivalMaterial, {
            localVue,
            store
        });

        startJobSpy = jest.spyOn(wrapper.vm, 'startJob');
    });

    it('combined ingest-archival-description steps starts job with valid parameters', async() => {
        expect(wrapper.findComponent(JobFilesForm).exists()).toBe(true);

        // Select all mocked directories
        await wrapper.find('thead label.checkbox > input').trigger('click');
        await wrapper.findComponent(ContinueButton).vm.onClick();

        expect(wrapper.findComponent(IngestArchivalMaterialMetadataForm).exists()).toBe(true);
        await wrapper.findComponent(ContinueButton).vm.onClick();

        await wrapper.findComponent(StartJobButton).vm.onClick();
        expect(startJobSpy).toHaveBeenCalled();
        expect(validate(wrapper.vm.parameters)).toBe(true);
    });
});
