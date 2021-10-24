<template>
    <section class="tile is-ancestor">
        <div class="tile is-parent">
            <div class="tile is-child box">
                <OCROptionsForm
                    :initialOptions="options.ocr_options"
                    @options-updated="options = $event"
                />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Watch, Prop
} from 'vue-property-decorator';
import { IngestJournalOptions } from './IngestJournalParameters';
import OCROptionsForm from '@/job/OCROptionsForm.vue';

@Component({
    components: {
        OCROptionsForm
    }
})
export default class JournalOptionsForm extends Vue {
    @Prop({ required: true }) initialOptions!: IngestJournalOptions;
    options: IngestJournalOptions = this.initialOptions;

    @Watch('options')
    onOptionsChanged(options: IngestJournalOptions) {
        this.$emit('options-updated', options);
    }
}
</script>
