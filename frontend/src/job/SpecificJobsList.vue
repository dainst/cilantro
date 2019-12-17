<template>
    <section>
        <b-table
            v-if="jobsLoaded"
            :data="jobs"
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
                <b-table-column field="description" label="Description" sortable>
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
                <SpecificJobsList :jobIDs="getChildrenIDs(props.row.children)" />
            </template>
        </b-table>
        <div v-else>Loading jobs...</div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { getJobDetails, getJobList, Job } from './JobClient';
import { showError } from '@/util/Notifier.ts';

@Component({ name: 'SpecificJobsList' })
export default class SpecificJobsList extends Vue {
    @Prop(Array) jobIDs!: string[];
    @Prop() showAllJobs!: boolean;
    jobs: Job[] = [];

    getChildrenIDs = getChildrenIDs;

    mounted() {
        this.loadJobs();
    }

    get jobsLoaded() {
        return this.jobIDs.length === 0 || this.jobs.length === this.jobIDs.length; // leere liste
    }

    async loadJobs() {
        if (this.jobIDs.length === 0) {
            this.jobs = await getJobList(this.showAllJobs);
        } else {
            for await (const id of this.jobIDs) { // eslint-disable-line no-restricted-syntax
                this.jobs.push(await getJobDetails(id));
            }
        }
    }

    @Watch('showAllJobs')
    onChanged(showAllJobs: boolean) {
        this.loadJobs();
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

function iconAttributesForState(state: string) {
    if (state === 'new') {
        return [{ type: 'is-info' }, { icon: 'alarm' }];
    } if (state === 'failure') {
        return [{ type: 'is-danger' }, { icon: 'alert' }];
    } if (state === 'success') {
        return [{ type: 'is-success' }, { icon: 'check' }];
    }
    return [{ type: 'is-warning' }, { icon: 'cogs' }];
}
</script>
