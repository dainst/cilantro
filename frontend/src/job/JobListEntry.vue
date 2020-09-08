<template>
    <section>

        <div v-if="isLoading">Loading jobs...</div>
        <div v-else-if="filteredJobs.length === 0">No jobs available</div>
        <b-table
            v-else
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
                    <div class="field is-grouped">
                        <b-button icon-right="arrow-bottom-right" class="is-dark"
                                @click="goToSingleView(props.row.job_id)">
                            View
                        </b-button>

                        <b-button v-if="isTopLevel"
                            icon-right="delete"
                            class="is-danger"
                            @click="removeJob(props.row.job_id)">
                        </b-button>
                    </div>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props" v-if="props.row.children.length > 0">
                <JobListEntry :jobIDs="getChildrenIDs(props.row.children)" />
            </template>
        </b-table>
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
import { showError } from '@/util/Notifier';

@Component({ name: 'JobListEntry' })
export default class JobListEntry extends Vue {
    @Prop(Array) jobIDs!: string[];
    @Prop() activeStates!: string[];
    unfilteredJobs: Job[] = [];
    isLoading: boolean = true;
    updatePendingJobsInterval: number = 0;
    getChildrenIDs = getChildrenIDs;

    isTopLevel = false;

    mounted() {
        if (this.jobIDs.length === 0) {
            this.isTopLevel = true;

            this.updatePendingJobsInterval = setInterval(() => {
                this.loadJobs();
            }, 10000);
        }

        this.loadJobs();
    }

    get filteredJobs() {
        if (this.isTopLevel) {
            return this.unfilteredJobs.filter(job => this.activeStates.includes(job.state));
        }
        return this.unfilteredJobs;
    }

    async loadJobs() {
        if (this.isTopLevel) {
            this.unfilteredJobs = await getJobList();
        } else {
            const requests = this.jobIDs.map(id => getJobDetails(id));
            this.unfilteredJobs = await Promise.all(requests)
                .then(values => values)
                .catch((reason) => {
                    showError(reason, reason);
                    return [];
                });
        }

        this.isLoading = false;
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
                this.unfilteredJobs = this.unfilteredJobs.filter(ele => ele.job_id !== id);
                archiveJob(id).catch((response) => {
                    showError('Failed to archive job!', response.error);
                });
            }
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
