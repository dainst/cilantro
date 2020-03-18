<template>
    <div>
        <p class="title">Application Options</p>
        <b-field>
            <b-switch v-model="options.keep_staging">
                Keep successfully processed files in staging area
            </b-switch>
        </b-field>
    </div>
</template>

<script lang="ts">

import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { AppOptions } from './JobParameters';

@Component
export default class AppOptionsForm extends Vue {
    @Prop({ required: true }) initialOptions!: AppOptions;
    options: AppOptions = this.initialOptions;

    @Watch('options')
    onOptionsChanged(options: AppOptions) {
        this.$emit('options-updated', options);
    }
}
</script>
