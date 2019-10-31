<template>
    <section>
        <div class="navbar-end">
            <div class="navbar-item">
        <b-switch v-model="showAllJobs" v-on:input="updateJobList">
            Show all
        </b-switch>
            </div>
        </div>
        <div v-if="jobList.length > 0">
            <SpecificJobsList :jobs="this.jobList"></SpecificJobsList>
        </div>
        <div v-else class="container">
            <b-notification type="is-info" has-icon :closable="false">
                No jobs found
            </b-notification>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getJobList } from './JobClient';
import { Job } from './Job';
import { showError } from '@/util/Notifier.ts';
import SpecificJobsList from '@/job/SpecificJobsList.vue';

@Component({
    components: { SpecificJobsList }
})
export default class JobList extends Vue {
    jobList: Job[] = [];
    showAllJobs:boolean = false;

    mounted() {
        this.updateJobList();
    }

    async updateJobList() {
        try {
            this.jobList = await getJobList(this.showAllJobs);
        } catch (e) {
            showError('Failed to load job list from server!', e);
        }
    }
}
</script>
