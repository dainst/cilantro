<template>
    <section>
        <b-table :data="jobList" detailed detail-key="job_id"
                 default-sort="created" :default-sort-direction="'asc'"
                 :has-detailed-visible="(row) => { return row.children.length >0 }"
                 @details-open="(row, index) => loadChildJobs(row)">
            <template slot-scope="props">
                <b-table-column field="job_type" label="Type" sortable>
                    {{ props.row.job_type }}
                </b-table-column>
                <b-table-column field="state" label="Status" sortable>
                    <div class="is-flex">
                        <b-icon v-bind="iconAttributesForState(props.row.state)"/>
                        {{ props.row.state }}
                    </div>
                </b-table-column>
                <b-table-column field="name" label="Name" sortable>
                    {{ props.row.name }}</b-table-column>
                <b-table-column field="job_id" label="ID" sortable>
                    {{ props.row.job_id }}
                </b-table-column>
                <b-table-column field="created" label="Created"
                                :custom-sort="sortByCreated" sortable>
                    {{ props.row.created }}
                </b-table-column>
                <b-table-column field="updated" label="Updated"
                                :custom-sort="sortByUpdated" sortable>
                    {{ props.row.updated }}
                </b-table-column>
                <b-table-column>
                    <b-button @click="goToSingleView(props.row.job_id)">Single View</b-button>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props" v-if="props.row.children.length > 0">
                <SpecificJobsList v-if=childJobsLoaded :jobs="childJobs" />
                <div v-else>
                    Loading child jobs...
                </div>
            </template>
        </b-table>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getJobDetails, getJobList, Job } from './JobClient';
import { showError } from '@/util/Notifier.ts';

@Component
export default class SpecificJobsList extends Vue {
    @Prop(Array) jobs!: Job[];
    jobList: Job[] = this.jobs;
    childJobs: Job[] = [];

    get childJobsLoaded() {
        return this.childJobs.length > 0;
    }

    async loadChildJobs(job: any) {
        const childJobs: Job[] = [];
        for await (const child of job.children) { // eslint-disable-line no-restricted-syntax
            childJobs.push(await getJobDetails(child.job_id));
        }
        this.childJobs = childJobs;
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

function sortByUpdated(a: Job, b: Job, isAsc: boolean) { // TODO return value
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
