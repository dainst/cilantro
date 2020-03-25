import {shallowMount, createLocalVue, mount} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex';

import JobListEntry from '@/job/JobListEntry.vue';
import {Job } from '@/job/JobClient';

jest.mock('@/job/JobClient', () => ({
        getJobList(){ 
            return  [{
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
            }];
        },
        iconAttributesForState(state: string){
            return [{ type: 'is-info' }, { icon: 'alarm' }];
        }
    })
)

// getJobList.mockImplementation(() => _getJobList());

const localVue = createLocalVue();
localVue.use(Buefy, {
    defaultIconPack: 'mdi',
    defaultContainerElement: '#content'
})
localVue.use(Vuex)


jest.useFakeTimers();

describe("JobListEntry.vue", () => {
    const wrapper = shallowMount(JobListEntry)

    it("loads proberly", () => {
        expect(wrapper.exists()).toBe(true)
    })

    it("no jobs no list", () => {
        expect(wrapper.contains('div.loading')).toBe(true)
    })
})

test("should render a table", async () => {
    const store = new Store({});
    const wrapper = shallowMount(JobListEntry, { 
        propsData: {
            jobIDs: [],
            activeStates: ['new', 'success', 'failure', 'started']
        },
        data() {
            return {
                unfilteredJobs: _getJobList()
            };
        },
        store,
        localVue
      })
    
    expect(wrapper.contains('b-table-stub')).toBe(true);
    expect(wrapper.contains('div.loading')).toBe(false);
    
});


function _getJobList(): Job[] {
    return [{
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
    }]
} 