<template>
    <div class="container">
        <div class="tile is-ancestor">
            <div class="tile is-4 is-vertical is-parent">
                <div class="tile is-child">
                    <MainMenu />
                    <hr>
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
import MainMenu from './MainMenu.vue';
import JobList from './JobList.vue';
import StartJobSelection from './StartJobSelection.vue';

@Component({
    components: {
        MainMenu,
        JobList,
        StartJobSelection
    }
})
export default class Dashboard extends Vue {}
</script>
