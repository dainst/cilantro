<template>
    <div>
        <div class="container">
            <div  class="title">
                 <b-button class="is-dark"
                    v-if="job.parent_job_id"
                    @click="goToSingleView(job.parent_job_id)">
                    <b-icon icon="arrow-top-left"></b-icon></b-button> {{job.name}}
            </div>
            <b-field label="ID">
                <p>{{job.job_id}}</p>
            </b-field>
            <b-field label="Name">
                <p>{{job.label}}</p>
            </b-field>
            <b-field label="Description">
                <p>{{job.description}}</p>
            </b-field>
            <b-field label="Status">
                <p>{{job.state}}</p>
            </b-field>
            <b-field label="User" v-if="job.user">
                <p>{{job.user}}</p>
            </b-field>
            <b-field label="Created">
                <p>{{job.created}}</p>
            </b-field>
            <b-field label="Last Updated">
                <p>{{job.updated}}</p>
            </b-field>
            <b-field label="Duration">
                <p>{{job.duration}}</p>
            </b-field>
            <b-field label="Children" v-if="job.children && job.children.length > 0">
                <b-table :data="job.children"
                         default-sort="created" :default-sort-direction="'asc'">
                    <template slot-scope="props">
                        <b-table-column field="label" label="Name">
                            {{ props.row.label}}
                        </b-table-column>
                        <b-table-column field="state" label="Status">
                            {{ props.row.state}}
                        </b-table-column>
                        <b-table-column field="job_id" label="ID">
                                {{ props.row.job_id}}
                        </b-table-column>
                        <b-table-column field="detail">
                            <b-button icon-right="arrow-bottom-right" class="is-dark"
                                      @click="goToSingleView(props.row.job_id)">
                                View
                            </b-button>
                        </b-table-column>
                    </template>
                </b-table>
            </b-field>

            <b-collapse class="card" :open="false" aria-id="job-params">
                <div
                    slot="trigger" 
                    slot-scope="props"
                    class="card-header"
                    role="button"
                    aria-controls="job-params">
                    <p class="card-header-title">
                        Show Job Parameters
                    </p>
                    <a class="card-header-icon">
                        <b-icon
                            :icon="props.open ? 'menu-up' : 'menu-down' ">
                        </b-icon>
                    </a>
                </div>
                <div class="card-content">
                    <pre>{{ job.parameters }}</pre>
                </div>
            </b-collapse>

            <b-message v-if="job.errors && job.errors.length > 0"
                       title="Errors" type="is-danger" has-icon :closable="false">
                <b-table :data="job.errors">
                    <template slot-scope="props">
                        <b-table-column field="job_name" label="Failed task name">
                            {{props.row.job_name}}
                        </b-table-column>
                        <b-table-column field="job_id" label="Failed task ID">
                            {{props.row.job_id}}
                        </b-table-column>
                    <b-table-column field="message" label="Error">
                        {{ props.row.message}}
                    </b-table-column>
                    <b-table-column field="job_id" label="">
                        <b-button @click="goToSingleView(props.row.job_id)">Show Task</b-button>
                    </b-table-column>
                    </template>
                </b-table>
            </b-message>

            <b-collapse class="card" :open="false" aria-id="job-log" v-if="job.log && job.log.length > 0">
                <div
                    slot="trigger" 
                    slot-scope="props"
                    class="card-header"
                    role="button"
                    aria-controls="job-log">
                    <p class="card-header-title">
                        Show Job Log
                    </p>
                    <a class="card-header-icon">
                        <b-icon
                            :icon="props.open ? 'menu-up' : 'menu-down' ">
                        </b-icon>
                    </a>
                </div>
                <div class="card-content">
                    <pre>{{job.log}}</pre>
                </div>
            </b-collapse>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BField from 'buefy/src/components/field/Field.vue';
import { getJobDetails, Job } from './JobClient';
import { showError } from '@/util/Notifier.ts';

@Component({
    components: { BField }
})
export default class JobDetails extends Vue {
    jobID: string = '';
    job: Job = {} as any;

    mounted() {
        this.jobID = this.$route.query.id as string;
        this.loadJobDetails();
    }

    goToSingleView(id: string) {
        this.$router.push({
            query: { id }
        });
        this.jobID = id;
        this.loadJobDetails();
    }

    gotoJobsView() {
        this.$router.push({ path: 'jobs' });
    }

    async loadJobDetails() {
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
