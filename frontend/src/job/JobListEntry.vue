<template>
    <section>
        <b-table
            v-if="jobsLoaded"
            :data="filteredJobs"
            detailed
            detail-key="job_id"
            default-sort="created"
            :default-sort-direction="'asc'"
            :has-detailed-visible="(row) => { return row.children.length >0 }"
        >
            <template slot-scope="props">
                <b-table-column field="state" label="Status" sortable>
                    <div class="is-flex">
                        <b-icon v-bind="iconAttributesForState(props.row.state)" />
                    </div>
                </b-table-column>
                <b-table-column field="label" label="Name" sortable>
                    {{ props.row.label }}
                </b-table-column>
                <b-table-column field="description" label="Description">
                    {{ props.row.description }}
                </b-table-column>
                <b-table-column field="id" label="ID" sortable>{{props.row.job_id}}</b-table-column>
                <b-table-column
                    field="created"
                    label="Created"
                    :custom-sort="sortByCreated"
                    sortable
                >{{ props.row.created }}</b-table-column>
                <b-table-column
                    field="updated"
                    label="Updated"
                    :custom-sort="sortByUpdated"
                    sortable
                >{{ props.row.updated }}</b-table-column>
                <b-table-column>
                    <b-button icon-right="arrow-bottom-right" class="is-dark"
                              @click="goToSingleView(props.row.job_id)">
                        View
                    </b-button>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props" v-if="props.row.children.length > 0">
                <JobListEntry :jobIDs="getChildrenIDs(props.row.children)" />
            </template>
        </b-table>
        <div v-else>Loading jobs...</div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
    getJobDetails, getJobList, iconAttributesForState, Job
} from './JobClient';
import { showError } from '@/util/Notifier.ts';

@Component({ name: 'JobListEntry' })
export default class JobListEntry extends Vue {
    @Prop(Array) jobIDs!: string[];
    @Prop() activeStates!: string[];
    unfilteredJobs: Job[] = [];
    updatePendingJobsInterval: number = 0;

    getChildrenIDs = getChildrenIDs;

    mounted() {
        this.loadJobs();
        this.updatePendingJobsInterval = setInterval(() => {
            this.loadJobs();
            if (this.jobsLoaded) {
                clearInterval(this.updatePendingJobsInterval);
            }
        }, 5000);
    }

    get jobsLoaded() {
        return this.unfilteredJobs.length !== 0;
    }

    get filteredJobs() {
        if (this.jobIDs.length === 0) {
            return this.unfilteredJobs.filter(job => this.activeStates.includes(job.state));
        }
        return this.unfilteredJobs;
    }

    async loadJobs() {
        if (this.jobIDs.length === 0) {
            this.unfilteredJobs = await getJobList();
        } else {
            const requests = this.jobIDs.map(id => getJobDetails(id));
            this.unfilteredJobs = await Promise.all(requests);
        }
    }

    sortByCreated = sortByCreated;
    sortByUpdated = sortByUpdated;
    compareDates = compareDates;
    iconAttributesForState = iconAttributesForState;

    goToSingleView(id: string) {
        this.$router.push({
            path: 'job',
            query: { id }
        });
    }
}

function getChildrenIDs(children: Job[]) {
    return children.map(child => child.job_id);
}

function sortByUpdated(a: Job, b: Job, isAsc: boolean) {
    const d1 = new Date(a.updated);
    const d2 = new Date(b.updated);
    return compareDates(d1, d2, isAsc);
}

function sortByCreated(a: Job, b: Job, isAsc: boolean) {
    const d1 = new Date(a.created);
    const d2 = new Date(b.created);
    return compareDates(d1, d2, isAsc);
}

function compareDates(a: Date, b: Date, isAsc: boolean) {
    return isAsc ? b.getTime() - a.getTime() : a.getTime() - b.getTime();
}
</script>
