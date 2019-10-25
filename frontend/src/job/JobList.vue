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
            <SpecificJobsList :jobs="this.jobList"></SpecificJobsList>
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
import { showError } from '@/util/Notifier.ts';
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

    async updateJobList() {
        try {
            this.jobList = await getJobList(this.show_all);
        } catch (e) {
            showError('Failed to load job list from server!', e);
        }
    }
}
</script>
