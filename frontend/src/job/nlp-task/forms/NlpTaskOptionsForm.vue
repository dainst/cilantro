<template>
    <section class="tile is-ancestor">
        <div class="tile is-parent">
            <div class="tile is-child box">
                <p class="title">NLP Task Options</p>
                <b-field>
                    <b-switch
                        v-model="options.tag_intervals"
                        @change="logOptions()"
                    >Do interval tagging</b-switch>
                </b-field>
                <b-field>
                    <b-select placeholder="Input language" v-model="options.lang" @change="logOptions()">
                        <option 
                            v-for="lang in langs"
                            :value="lang.short"
                            :key="lang.short"
                        >{{ lang.long }}</option>
                    </b-select>
                </b-field>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Watch, Prop
} from 'vue-property-decorator';
import { NlpTaskOptions } from '../NlpTaskParameters';
import JobOptionsForm from '../../JobOptionsForm.vue';

@Component({
    components: {
        JobOptionsForm
    }
})
export default class NlpTaskOptionsForm extends Vue {
    @Prop({ required: true }) initialOptions!: NlpTaskOptions;
    options: NlpTaskOptions = JSON.parse(JSON.stringify(this.initialOptions));
    langs = [
        { short: "en", long: "English" },
        { short: "fr", long: "French" },
        { short: "de", long: "German" },
        { short: "it", long: "Italian" },
        { short: "es", long: "Spanish" },
    ]

    logOptions() {
        console.log(this.options);
    }

    @Watch('options')
    onOptionsChanged(options: NlpTaskOptions) {
        console.log(options)
        this.$emit('options-updated', options);
    }
}
</script>
