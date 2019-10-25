<template>
    <section>
        <div v-if="jobList.length > 0">
        <b-table :data="jobList" detailed detail-key="job_id"
            default-sort="created" :default-sort-direction="'asc'" :has-detailed-visible="(row) => { return row.children.length >0 }">
            <template slot-scope="props">
                <b-table-column field="job_type" label="Type" sortable>
                    {{ props.row.job_type }}
                </b-table-column>
                <b-table-column field="state" label="Status" sortable>
                    <div class="is-flex">
                        <b-icon
                            v-bind="iconAttributesForState(props.row.state)"/>
                        {{ props.row.state }}
                    </div>
                </b-table-column>
                <b-table-column field="name" label="Name" sortable>
                    {{ props.row.name }}</b-table-column>
                <b-table-column field="job_id" label="ID" sortable>
                    {{ props.row.job_id }}
                </b-table-column>
                <b-table-column field="created" label="Created" :custom-sort="sortByCreated" sortable>
                    {{ props.row.created }}
                </b-table-column>
                <b-table-column field="updated" label="Updated" :custom-sort="sortByUpdated" sortable>
                    {{ props.row.updated }}
                </b-table-column>
                <b-table-column>
                    <b-button @click="goToSingleView(props.row.job_id)">Single View</b-button>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props" v-if="props.row.children.length > 0">
                <div v-if="props.row.children.length > 0">
                    <SpecificJobsList :job_ids="get_children_ids(props.row.children)"></SpecificJobsList>
                </div>
                <div v-else>
                    No childrens for this Job
                </div>
            </template>
        </b-table>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import {getJobDetails, getJobList} from './JobClient';
import { Job } from './Job';
import { ChildJob } from './ChildJob';
import { showError } from '@/util/Notifier.ts';
import moment from 'moment';

@Component
export default class SpecificJobsList extends Vue {
    @Prop(Array) job_ids!: string[];
    @Prop(Array) jobs!: Job[];
    jobList: Job[] = [];
    show_all:boolean = false;
    mounted() {
        this.updateJobList();
    }
    iconAttributesForState = (state: string) => {
        if (state === 'new') {
            return [{ type: 'is-info' }, { icon: 'alarm' }];
        } if (state === 'failure') {
            return [{ type: 'is-danger' }, { icon: 'alert' }];
        } if (state === 'success') {
            return [{ type: 'is-success' }, { icon: 'check' }];
        }
        return [{ type: 'is-warning' }, { icon: 'cogs' }];
    };
    get_children_ids(children:ChildJob[]){
        let id_list = [];
        for(var i = 0; i<children.length; i++){
            id_list.push(children[i].job_id);
        }
        return id_list;
    }

    goToSingleView(id: string) {
        this.$router.push({
            path: 'job',
            query: { id }
        });
    }

    sortByUpdated(a:Job, b:Job, isAsc:boolean) {
        var d1 = moment(a.updated, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
        var d2 = moment(b.updated, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
        return this.compareDates(d1,d2,isAsc);
    }
    sortByCreated(a:Job, b:Job, isAsc:boolean) {
        var d1 = moment(a.created, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
        var d2 = moment(b.created, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
        return this.compareDates(d1,d2,isAsc);
    }
    compareDates(a:Date, b:Date, isAsc:boolean){
        if (isAsc) {
            return b.getTime()-a.getTime();
        } else {
            return a.getTime() - b.getTime();
        }
    }

    async updateJobList() {
        try {
            if(this.jobs){
                this.jobList = this.jobs;
            }else{
                this.jobList = [];
                for(var i =0;i<this.job_ids.length; i++){
                    let job = await getJobDetails(this.job_ids[i]);
                    this.jobList.push(job);
                }
            }
            this.$forceUpdate();
        } catch (e) {
            showError('Failed to load job list from server!', e);
        }
    }
}
</script>
