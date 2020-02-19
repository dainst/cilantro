<template>
  <b-collapse
                aria-id="processing_options_collapse"
                class="panel"
                :open.sync="isOpen">
        <div
                slot="trigger"
                class="panel-heading"
                role="button"
                aria-controls="processing_options_collapse">
            <strong>Post-Processing Options</strong>
        </div>
        <div class="panel-block">
        <b-field>
            <b-switch v-model="options.keep_staging">
               Keep imported raw data on server
            </b-switch>
        </b-field>
        </div>
  </b-collapse>
</template>

<script lang="ts">
 
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { AppOptions } from './JobParameters';

@Component
export default class AppOptionsForm extends Vue {
    @Prop({ required: true }) initialOptions!: AppOptions;

    
    isOpen = false;
        

    options: AppOptions = this.initialOptions;

    @Watch('options')
    onOptionsChanged(options: AppOptions) {
        this.$emit('options-updated', options);
    }
}
</script>
