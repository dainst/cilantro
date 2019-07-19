<template>
    <div class="container">
        <div class="tile is-ancestor">
            <div class="tile is-4 is-vertical is-parent">
                <div class="tile is-child">
                    <MainMenu/>
                </div>
                <div class="tile is-child">
                    <RunningJobsList/>
                </div>
            </div>
            <div class="tile is-vertical is-parent">
                <div class="tile is-child">
                    <StartJobSelection/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MainMenu from '@/components/MainMenu.vue'
import RunningJobsList from '@/components/RunningJobsList.vue'
import StartJobSelection from '@/components/StartJobSelection.vue'

@Component({
    components: {
        MainMenu,
        RunningJobsList,
        StartJobSelection
    }
})
export default class Dashboard extends Vue {
}
</script>
