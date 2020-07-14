<template>
    <section>
        <b-table
            v-if="!emptyJobList"
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

                    <b-button v-if="!props.row.parent_job_id" icon-right="delete" class="is-danger"
                              @click="removeJob(props.row.job_id)">
                        Remove
                    </b-button>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props" v-if="props.row.children.length > 0">
                <JobListEntry :jobIDs="getChildrenIDs(props.row.children)" />
            </template>
        </b-table>
        <div v-else-if="jobsLoading">Loading jobs...</div>
        <div v-else-if="errorLoading">There has been an error. JobList in unexpected state</div>
        <div v-else-if="emptyJobList">No jobs found</div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
    archiveJob,
    getJobDetails, getJobList, iconAttributesForState, Job
} from './JobClient';
import { showError } from '@/util/Notifier.ts';

enum LoadState {
        loaded,
        empty,
        loading,
        error
    }

@Component({ name: 'JobListEntry' })
export default class JobListEntry extends Vue {
    @Prop(Array) jobIDs!: string[];
    @Prop() activeStates!: string[];
    unfilteredJobs: Job[] = [];
    loadingState: LoadState = LoadState.loading;
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
        return this.loadingState == LoadState.loaded;
    }

    get jobsLoading() {
        return this.loadingState == LoadState.loading;
    }

    get errorLoading() {
        return this.loadingState == LoadState.error;
    }

    get emptyJobList() {
        return (this.unfilteredJobs !== null && Array.isArray(this.unfilteredJobs) && this.unfilteredJobs.length === 0);
    }

    get filteredJobs() {
        if (this.unfilteredJobs && this.jobIDs.length === 0) {
            return this.unfilteredJobs.filter(job => this.activeStates.includes(job.state));
        }
        return this.unfilteredJobs;
    }

    async loadJobs() {
        this.loadingState = LoadState.loading;

        if (this.jobIDs.length === 0) {
            this.unfilteredJobs = await getJobList();
        } else {
            const requests = this.jobIDs.map(id => getJobDetails(id));
            this.unfilteredJobs = await Promise.all(requests);
        }

        this.setJobListState();
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

    removeJob(id: string) {
        this.$buefy.dialog.confirm({
            message: `Delete Job ${id}?`,
            onConfirm: () => {
                this.unfilteredJobs = this.unfilteredJobs.filter(ele => ele.job_id != id);
                archiveJob(id).catch((response) => {
                        showError('Failed to archive job!', response.error);

                });
            }
        });
    }

    setJobListState() {
        if (Array.isArray(this.unfilteredJobs) && this.unfilteredJobs.length !== 0) {
            this.loadingState = LoadState.loaded;
        } else if (Array.isArray(this.unfilteredJobs) && this.unfilteredJobs.length === 0) {
            this.loadingState = LoadState.empty;
        } else {
            this.loadingState = LoadState.error;
            this.unfilteredJobs = [];
        }
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
