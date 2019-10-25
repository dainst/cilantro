<template>
    <section>
        <div class="navbar-end">
            <div class="navbar-item">
        <b-switch v-model="show_all" v-on:input="updateJobList">
            Show all
        </b-switch>
            </div>
        </div>
        <div v-if="jobList.length > 0">
        <b-table :data="jobList" detailed detail-key="job_id"
            default-sort="created" :default-sort-direction="'asc'">
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
            <template slot="detail" slot-scope="props">
                <div v-if="props.row.children.length > 0">
                    <SpecificJobsList :job_ids="get_children_ids(props.row.children)"></SpecificJobsList>
                </div>
                <div v-else>
                    No childrens for this Job
                </div>
            </template>
        </b-table>
        </div>
        <div v-else class="container">
            <b-notification type="is-info" has-icon :closable="false">There are no Jobs yet</b-notification>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getJobList } from './JobClient';
import { Job } from './Job';
import { ChildJob } from './ChildJob';
import { showError } from '@/util/Notifier.ts';
import moment from 'moment';
import SpecificJobsList from "@/job/SpecificJobsList.vue";
@Component({
    components: {SpecificJobsList}
})
export default class JobList extends Vue {
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
        for(let i = 0;i<children.length; i++){
            id_list.push(children[i]['job_id']);
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
        let d1 = moment(a.updated, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
        let d2 = moment(b.updated, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
        return this.compareDates(d1,d2,isAsc);
    }
    sortByCreated(a:Job, b:Job, isAsc:boolean) {
        let d1 = moment(a.created, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
        let d2 = moment(b.created, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
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
            this.jobList = await getJobList(this.show_all);
        } catch (e) {
            showError('Failed to load job list from server!', e);
        }
    }
}
</script>
