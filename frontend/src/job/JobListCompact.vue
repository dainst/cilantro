<template>
    <section class="job-shortlist" v-if="getUnfinishedJobs().length>0">
        <div>
            <h3 class="is-size-5">
                Your active jobs
                <a @click="updateJobList">
                    <b-icon icon="refresh" size="is-small"></b-icon>
                </a>
            </h3>
            <div v-for="job in getUnfinishedJobs()" :key="job['job_id']">
                <router-link class="message" :to="{ name: 'job', query: { id: job['job_id'] }}">
                    <div class="message-header">
                        <b-icon v-bind="iconAttributesForState(job['state'])"></b-icon>
                        {{job['job_type']}}
                    </div>
                    <div class="message-body has-text-left">
                        <div>
                            <span class="has-text-weight-semibold">Name:</span>
                            {{job['name']}}
                        </div>
                        <div>
                            <span class="has-text-weight-semibold">Created:</span>
                            {{job['created']}}
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getJobList, iconAttributesForState, Job } from './JobClient';
import { showError } from '@/util/Notifier';

@Component
export default class JobListCompact extends Vue {
    jobList: Job[] = [];

    getUnfinishedJobs() {
        if (Array.isArray(this.jobList)) {
            return this.jobList.filter(job => job.state !== 'success');
        } 
        return [];
    }

    iconAttributesForState = iconAttributesForState

    async updateJobList() {
        try {
            this.jobList = await getJobList();
        } catch (e) {
            showError('Failed to load job list from server', e.message);
        }
        this.jobList.reverse();
    }

    mounted() {
        this.updateJobList();
    }
}
</script>

<style lang="scss">
.job-shortlist {
    padding: 15px;
    border: solid;
    border-width: 1px;
    overflow-y: auto;
    height:800px;
}

.message .message-body {
    background-color: lightgray;
    margin-bottom: 10px;
}
</style>
