<template>
    <div>
        <b-button @click="gotoJobsView">View All Jobs</b-button>
        <div class="container">
            <div v-if="job.parent_job_id">
                <b-button @click="goToSingleView(job.parent_job_id)">Go to Parent Job</b-button>
            </div>
            <b-field label="ID">
                <p>{{job.job_id}}</p>
            </b-field>
            <b-field label="Name">
                <p>{{job.name}}</p>
            </b-field>
            <b-field label="Type">
                <p>{{job.job_type}}</p>
            </b-field>
            <b-field label="Status">
                <p>{{job.state}}</p>
            </b-field>
            <b-field label="User">
                <p>{{job.user}}</p>
            </b-field>
            <b-field label="Created">
                <p>{{job.created}}</p>
            </b-field>
            <b-field label="Last Updated">
                <p>{{job.updated}}</p>
            </b-field>
            <b-field label="Duration">
                <p v-if="job.state = 'success' || job.errors.length > 0">{{getDuration(getDateFromGMTString(job.created),getDateFromGMTString(job.updated))}}</p>
                <p v-else>In Progress: {{getDuration(getDateFromGMTString(job.created),Date.now())}}</p>
            </b-field>

            <b-field label="Children" v-if="job.children.length > 0">
                    <b-table :data="job.children"
                             default-sort="created" :default-sort-direction="'asc'">
                        <template slot-scope="props">
                            <b-table-column field="type" label="Type">
                                {{ props.row.type}}
                            </b-table-column>
                            <b-table-column field="state" label="Status">
                                {{ props.row.state}}
                            </b-table-column>
                            <b-table-column field="job_id" label="ID">
                                {{ props.row.job_id}}
                            </b-table-column>
                            <b-table-column field="job_id" label="">
                                <b-button @click="goToSingleView(props.row.job_id)">Single View</b-button>
                            </b-table-column>
                        </template>
                    </b-table>
            </b-field>
            <b-message v-if="job.errors.length > 0" title="Errors" type="is-danger" has-icon :closable="false">
                <b-table :data="job.errors" :columns="[{field: 'task_name',
                        label: 'Task name'}, {field: 'message',
                        label: 'Message'}]"></b-table>
            </b-message>

            <b-collapse :open="false" aria-id="job-params">
                <button class="button" slot="trigger" aria-controls="job-params">
                    Show Job Parameters
                </button>
                <pre>{{ job.parameters }}</pre>
            </b-collapse>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Job } from './Job';
import { getJobDetails } from './JobClient';
import { showError } from '@/util/Notifier.ts';
import BField from "buefy/src/components/field/Field.vue";
import moment from 'moment';

@Component({
    components: {BField}
})
export default class JobDetails extends Vue {
    labelPosition: string = '';
    backendUri = this.$store.state.AuthenticationStore.backendUri;

    jobID: string = '';
    job: Job = {} as any;

    mounted() {
        this.jobID = this.$route.query.id as string;
        this.getJobDetails();
    }

    goToSingleView(id: string) {
        this.$router.push({
            query: { id }
        });
        this.jobID = id;
        this.getJobDetails();
        this.$forceUpdate();
        console.log(this.jobID);
    }

    getDuration(t1:number,t2:number){
        if(t2 && t1){
            if(t2-t1 > 0){
                var duration = new Date(t2-t1);
                return duration.toISOString().slice(11, -1);
            }
        }
        return "Not available";
    }
    getDateFromGMTString(d:string) : Date{
        return moment(d, 'ddd, DD MMM YYYY HH:mm:ss').toDate();
    }
    gotoJobsView() {
        this.$router.push({ path: 'jobs' });
    }

    async getJobDetails() {
        try {
            this.job = await getJobDetails(this.jobID);
        } catch (e) {
            showError('Failed to retrieve job details from server!', e);
        }
    }

}
</script>

<style lang="scss">
.container {
    text-align: left;
}
</style>
