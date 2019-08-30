<template>
    <div class="container">
        <div class="tile is-ancestor">
            <div class="tile is-4 is-vertical is-parent">
                <div class="tile is-child">
                    <JobList />
                </div>
            </div>
            <div class="tile is-vertical is-parent">
                <div class="tile is-child">
                    <StartJobSelection />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import JobList from '@/job/JobList.vue';
import StartJobSelection from './StartJobSelection.vue';

@Component({
    components: {
        JobList,
        StartJobSelection
    }
})
export default class Dashboard extends Vue {}
</script>
