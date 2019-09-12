<template>
    <div>
        <StagingBrowser />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StagingBrowser from './StagingBrowser.vue';

@Component({
    components: {
        StagingBrowser
    }
})
export default class StagingArea extends Vue {

}
</script>
