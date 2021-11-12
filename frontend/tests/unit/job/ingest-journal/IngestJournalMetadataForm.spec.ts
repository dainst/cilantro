import {
    mount, createLocalVue
} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import IngestJournalMetadataForm from '@/job/ingest-journal/IngestJournalMetadataForm.vue';

import stagingTreeMock from '@/../tests/resources/ingest-journal/staging-tree-mock.json';
import { JobTargetError } from '@/job/JobParameters';
import { JobTargetData, JournalIssueMetadata } from '@/job/ingest-journal/IngestJournalParameters';

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
        wrapper = mount(IngestJournalMetadataForm, {
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

    it('invalid target causes rendered errors', async() => {
        const error = new JobTargetError('target_id', 'target_path', ['example error']);

        await wrapper.setData({ targets: [error] });
        // Toggle detail view
        await wrapper.find('tbody > tr > td.chevron-cell > a').trigger('click');

        expect(wrapper.find('.detail-container li').text()).toEqual('example error');
    });

    it('valid targets are rendered', async() => {
        const targets = [
            new JobTargetData(
                'target_id_1', 'target_path_1', new JournalIssueMetadata('000000000', 'journal_name_1', 'ojs_journal_code_1', 'issue_title_1')
            ),
            new JobTargetData(
                'target_id_2', 'target_path_2', new JournalIssueMetadata('000000001', 'journal_name_2', 'ojs_journal_code_2', 'issue_title_2')
            )
        ];

        await wrapper.setData({ targets });

        expect(wrapper.findAll('tbody tr')).toHaveLength(2);

        expect(wrapper.findAll('tbody tr td[data-label="Directory"]').at(0).text()).toContain('target_path_1');
        expect(wrapper.findAll('tbody tr td[data-label="Title"]').at(0).text()).toContain('journal_name_1');

        expect(wrapper.findAll('tbody tr td[data-label="Directory"]').at(1).text()).toContain('target_path_2');
        expect(wrapper.findAll('tbody tr td[data-label="Title"]').at(1).text()).toContain('journal_name_2');
    });
});
