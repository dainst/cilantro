<template>
    <section class="job-shortlist">
        <h3 class="is-size-5">
            Your active jobs
            <a @click="updateJobList">
                <b-icon icon="refresh" size="is-small"></b-icon>
            </a>
        </h3>
        <div v-for="job in jobList" :key="job['job_id']">
            <router-link class="message" :to="{ name: 'job', query: { id: job['job_id'] }}">
                <div class="message-header">
                    <b-icon v-bind="iconAttributesForState(job['state'])"></b-icon>
                    {{job['job_id']}}
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
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getJobList } from './JobClient';
import { Job } from './Job';
import { showError } from '@/util/Notifier.ts';

@Component
export default class JobListCompact extends Vue {
    jobList: Job[] = [];

    iconAttributesForState = (state: string) => {
        if (state === 'new') {
            return [{ type: 'is-info' }, { icon: 'alarm' }];
        } if (state === 'started') {
            return [{ type: 'is-warning' }, { icon: 'cogs' }];
        } if (state === 'success') {
            return [{ type: 'is-success' }, { icon: 'check' }];
        }
        return [{ type: 'is-danger' }, { icon: 'alert' }];
    }

    async updateJobList() {
        try {
            this.jobList = await getJobList(false);
        } catch (e) {
            showError('Failed to load job list from server', e);
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
}

.message .message-body {
    background-color: lightgray;
    margin-bottom: 10px;
}
</style>
