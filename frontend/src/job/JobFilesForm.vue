<template>
    <section>
        <div class="is-size-4">Select the folders for the job:</div>
        <div style="padding-top:10px; padding-bottom:10px">
            <StagingBrowser
                :selected-paths="selectedPaths"
                @update:selected-paths="$emit('update:selected-paths', $event)"
            />
        </div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import StagingBrowser from '@/staging/StagingBrowser.vue';

@Component({
    components: {
        StagingBrowser
    }
})
export default class JobFilesForm extends Vue {
    @Prop({ default: () => [] }) private selectedPaths!: string[];
    @Prop() private acceptedFiletypes!: string;
}
</script>
