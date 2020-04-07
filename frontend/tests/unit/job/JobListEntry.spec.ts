import {shallowMount, createLocalVue, mount } from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex';
import JobListEntry from '@/job/JobListEntry.vue';
import {getJobList} from '@/job/JobClient';

// const mockGetJobList = ;

jest.mock('@/job/JobClient', () => ({
    getJobList: jest.fn()
}));

const localVue = createLocalVue();
localVue.use(Buefy, {
    defaultIconPack: 'mdi',
    defaultContainerElement: '#content'
})
localVue.use(Vuex)
const store = new Store({});

jest.useFakeTimers();

describe("JobListEntry.vue", () => {
    
    beforeEach(() => {
        jest.resetAllMocks();
        
    });

    it("loads proberly", () => {
        let wrapper = shallowMount(JobListEntry, { 
            propsData: {
                jobIDs: [],
                activeStates: ['new', 'success', 'failure', 'started']
            }
          });
        expect(wrapper.exists()).toBe(true)
    })

    it("jobs loading display 'loading jobs...'", async () => {
        let wrapper = shallowMount(JobListEntry, { 
            propsData: {
                jobIDs: [],
                activeStates: ['new', 'success', 'failure', 'started']
            }
          });
        expect(wrapper.text()).toBe('Loading jobs...')
    })

    it("zero jobs loaded display 'No jobs found'", async () => {
        (getJobList as jest.Mock).mockImplementationOnce(() => []);
        let wrapper = shallowMount(JobListEntry, { 
            propsData: {
                jobIDs: [],
                activeStates: ['new', 'success', 'failure', 'started']
            }
          });
        await wrapper.vm.$nextTick();
        expect(getJobList).toBeCalled();
        expect(wrapper.text()).toBe('No jobs found')
    })

    it("job list in wrong state", async () => {
        (getJobList as jest.Mock).mockImplementationOnce(() => Promise.resolve('The REST-Endpoint went missing!'))
        let wrapper = shallowMount(JobListEntry, { 
            propsData: {
                jobIDs: [],
                activeStates: ['new', 'success', 'failure', 'started']
            }
          });
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toBe('There has been an error. JobList in unexpected state')
    })

    it("should render a table", async () => {
        (getJobList as jest.Mock).mockImplementationOnce(() => Promise.resolve([{
            children: [{}],
            created: "2020-02-29",
            duration: "3600",
            errors: [{}], // TODO proper error interface
            log: [""],
            job_id: "001", // eslint-disable-line camelcase
            job_type: "", // eslint-disable-line camelcase
            name: "klaus",
            label: "Santa",
            description: "Das Haus vom Nikolaus",
            parameters: {},
            parent_job_id: "", // eslint-disable-line camelcase
            started: "",
            state: "new",
            updated: "",
            user: ""
        }]));
        let wrapper = shallowMount(JobListEntry, { 
            propsData: {
                jobIDs: [],
                activeStates: ['new', 'success', 'failure', 'started']
            },
            localVue,
            store
          });
        await wrapper.vm.$nextTick();
        expect(wrapper.contains('b-table-stub')).toBe(true);
        expect(wrapper.contains('div.loading')).toBe(false);
        
    })
})