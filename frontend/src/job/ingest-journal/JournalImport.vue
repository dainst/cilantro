<template>
    <div class="tile is-ancestor">
        <div v-if="jobType" class="tile is-vertical is-parent">
            <p class="tile is-child">{{ jobType }}</p>

            <b-steps v-model="activeStep" :animated="isAnimated" :has-navigation="hasNavigation">
                <b-step-item label="Journal Metadaten" :clickable="isStepsClickable">
                    Metadaten für das Journal
                    <JournalMetadataForm class="tile is-child" />
                </b-step-item>
                <b-step-item label="Artikelgrenzen und Metadaten" :clickable="isStepsClickable">
                    Geben sie hier den Ursprung und die Metadaten für die Artikel ein
                    <FilesAndRangesForm class="tile is-child" />
                </b-step-item>
                <b-step-item label="Publizierung" :clickable="isStepsClickable">
                    Daten zur Publizierung in OJS
                    <PublishingForm class="tile is-child" />
                </b-step-item>
            </b-steps>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JournalMetadataForm from './forms/JournalMetadataForm.vue'
import FilesAndRangesForm from './forms/FilesAndRangesForm.vue'
import PublishingForm from './forms/PublishingForm.vue'

@Component({
    components: {
        JournalMetadataForm,
        FilesAndRangesForm,
        PublishingForm
    }
})
export default class JournalImport extends Vue {
    data() {
        return {
            jobType: this.$store.state.job.type,

            activeStep: 0,
            isAnimated: true,
            hasNavigation: false,
            isStepsClickable: true
        }
    }
}
</script>

<style scoped lang="scss">
    div.step-item {
        font-style: italic;
        font-size: x-large;

    }

</style>
