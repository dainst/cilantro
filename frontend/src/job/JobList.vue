<template>
    <section>
        <div class="navbar">
            <div class="navbar-item">
                <b-button @click="showAll">
                    Show all
                </b-button>
            </div>
            <div class="navbar-item">
                <b-switch v-model="showSuccess">
                    Show successful
                </b-switch>
                <b-switch v-model="showFailure">
                    Show failure
                </b-switch>
                <b-switch v-model="showInProgress">
                    Show in progress
                </b-switch>
            </div>
        </div>
        <div>
            <SpecificJobsList :jobIDs="[]" :activeStates="activeStates"></SpecificJobsList>
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
    showSuccess: boolean = true;
    showFailure: boolean = true;
    showInProgress: boolean = true;

    showAll() {
        this.showSuccess = true;
        this.showFailure = true;
        this.showInProgress = true;
    }

    get activeStates() {
        const states = [];
        if (this.showSuccess) {
            states.push('success');
        }
        if (this.showFailure) {
            states.push('failure');
        }
        if (this.showInProgress) {
            states.push('new');
            states.push('started');
        }
        return states;
    }
}

</script>
