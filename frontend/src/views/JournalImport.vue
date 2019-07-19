<template>
    <div class="tile is-ancestor">
        <div class="tile is-vertical is-parent">
            <JournalMetadataForm class="tile is-child" />
            <FilesAndRangesForm class="tile is-child" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JournalMetadataForm from '@/components/forms/JournalMetadataForm.vue'
import FilesAndRangesForm from '@/components/forms/FilesAndRangesForm.vue'

@Component({
    components: {
        JournalMetadataForm,
        FilesAndRangesForm
    }
})
export default class JournalImport extends Vue { }
</script>

<style scoped lang="scss">
    FilesAndRangesForm {}

</style>
