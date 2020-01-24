<template>
    <section class="tile is-ancestor">
        <div class="tile is-parent">
            <div class="tile is-child box">
                <JobOptionsForm :initialOptions="options" @options-updated="options = $event" />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { IngestArchivalMaterialOptions } from './IngestArchivalMaterialParameters';
import JobOptionsForm from '../JobOptionsForm.vue';

@Component({
    components: {
        JobOptionsForm
    }
})
export default class ArchivalMaterialOptionsForm extends Vue {
    @Prop({ required: true }) initialOptions!: IngestArchivalMaterialOptions;
    options: IngestArchivalMaterialOptions = JSON.parse(JSON.stringify(this.initialOptions));

    @Watch('options')
    onOptionsChanged(options: IngestArchivalMaterialOptions) {
        this.$emit('options-updated', options);
    }
}

</script>
