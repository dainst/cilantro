<template>
    <section>
        <div class="navbar-end">
            <div class="navbar-item">
                <b-switch v-model="showAllJobs">
                    Show all
                </b-switch>
            </div>
        </div>
        <div>
            <SpecificJobsList :jobIDs="[]" :showAllJobs="showAllJobs"></SpecificJobsList>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SpecificJobsList from '@/job/SpecificJobsList.vue';

@Component({
    components: { SpecificJobsList }
})
export default class JobList extends Vue {
    showAllJobs: boolean = false;
}
</script>
