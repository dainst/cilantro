<template>
    <div>
        <b-button @click="gotoJobsView">View All Jobs</b-button>
        <div class="container">
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
            <b-message v-if="job.errors.length > 0" title="Errors" type="is-danger" has-icon :closable="false">
                <b-table :data="job.errors" :columns="[{field: 'task_name',
                        label: 'Task name'}, {field: 'message',
                        label: 'Message'}]"></b-table>
            </b-message>

            <b-collapse :open="false" aria-id="job-params">
                <button class="button" slot="trigger" aria-controls="job-params">Show Job Parameters</button>
                <pre><code>{{ job.params }}</code></pre>
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
