<template>
    <div>
        <b-button @click="gotoJobsView">View All Jobs</b-button>
        <div class="container">
            <b-field label="ID">
                <b-input v-model="job.job_id" readonly />
            </b-field>
            <b-field label="Name">
                <b-input v-model="job.name" readonly />
            </b-field>
            <b-field label="Type">
                <b-input v-model="job.job_type" readonly />
            </b-field>
            <b-field label="Status">
                <b-input v-model="job.state" readonly />
            </b-field>
            <b-field label="User">
                <b-input v-model="job.user" readonly />
            </b-field>
            <b-field label="Created">
                <b-input v-model="job.created" readonly />
            </b-field>
            <b-field label="Last Updated">
                <b-input v-model="job.updated" readonly />
            </b-field>

            <b-collapse :open="false" aria-id="job-params">
                <button class="button" slot="trigger" aria-controls="job-params">
                    Show Job Parameters
                </button>
                <div>
                    {{ job.params }}
                </div>
            </b-collapse>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Job } from './Job';
import { getJobDetails } from '@/util/WorkbenchClient';
import { showError } from '@/util/Notifier.ts';

@Component
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
            showError('Failed to retrieve job details from server!', this, e);
        }
    }
}
</script>

<style lang="scss">
    .container {
        text-align: left;
    }

</style>
