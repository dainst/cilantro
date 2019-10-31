<template>
    <section>
        <div v-if="jobList.length > 0">
        <b-table :data="jobList" detailed detail-key="job_id"
                 default-sort="created" :default-sort-direction="'asc'"
                 :has-detailed-visible="(row) => { return row.children.length >0 }">
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
                <SpecificJobsList :jobIDs="getChildrenIDs(props.row.children)" />
            </template>
        </b-table>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { getJobDetails, getJobList } from './JobClient';
import { Job } from './Job';
import { ChildJob } from './ChildJob';
import { showError } from '@/util/Notifier.ts';

@Component
export default class SpecificJobsList extends Vue {
    @Prop(Array) jobIDs!: string[];
    @Prop(Array) jobs!: Job[];
    jobList: Job[] = [];

    sortByCreated = sortByCreated;
    sortByUpdated = sortByUpdated;
    getChildrenIDs = getChildrenIDs;
    compareDates = compareDates;
    iconAttributesForState = iconAttributesForState;

    mounted() {
        this.updateJobList();
    }

    goToSingleView(id: string) {
        this.$router.push({
            path: 'job',
            query: { id }
        });
    }

    async updateJobList() {
        try {
            if (this.jobs) {
                this.jobList = this.jobs;
            } else {
                this.jobList = [];
                let i = 0;
                for (i; i < this.jobIDs.length; i += 1) {
                    let job = await getJobDetails(this.jobIDs[i]);
                    this.jobList.push(job);
                }
            }
            this.$forceUpdate();
        } catch (e) {
            showError('Failed to load job list from server!', e);
        }
    }
}

function sortByUpdated(a:Job, b:Job, isAsc:boolean) {
    const d1 = moment(a.updated, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
    const d2 = moment(b.updated, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
    return compareDates(d1, d2, isAsc);
}

function sortByCreated(a:Job, b:Job, isAsc:boolean) {
    const d1 = moment(a.created, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
    const d2 = moment(b.created, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
    return compareDates(d1, d2, isAsc);
}

function getChildrenIDs(children: ChildJob[]) {
    const idList = [];
    let i = 0;
    for (i; i < children.length; i += 1) {
        idList.push(children[i].job_id);
    }
    return idList;
}

function compareDates(a: Date, b: Date, isAsc: boolean) {
    if (isAsc) {
        return b.getTime() - a.getTime();
    }
    return a.getTime() - b.getTime();
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
