<template>
    <section class="tile is-ancestor">
        <div class="tile is-parent">
            <div class="tile is-child box">
                <p class="title">OJS Options</p>
                <b-field>
                    <b-switch
                        v-model="options.ojs_metadata.auto_publish_issue"
                    >Automatically publish issue</b-switch>
                </b-field>
                <b-field>
                    <b-switch
                        v-model="options.ojs_metadata.default_create_frontpage"
                    >Always create frontpage</b-switch>
                </b-field>
                <b-field>
                    <b-switch
                        v-model="options.ojs_metadata.allow_upload_without_file"
                    >Allow upload without file</b-switch>
                </b-field>
            </div>
            <div class="tile is-child box">
                <JobOptionsForm :initialOptions="options" @options-updated="options = $event" />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Watch, Prop
} from 'vue-property-decorator';
import { JournalImportOptions } from '../JournalImportParameters';
import JobOptionsForm from '../../JobOptionsForm.vue';

@Component({
    components: {
        JobOptionsForm
    }
})
export default class JournalOptionsForm extends Vue {
    @Prop({ required: true }) initialOptions!: JournalImportOptions;
    options: JournalImportOptions = JSON.parse(JSON.stringify(this.initialOptions));

    @Watch('options')
    onOptionsChanged(options: JournalImportOptions) {
        this.$emit('options-updated', options);
    }
}
</script>
