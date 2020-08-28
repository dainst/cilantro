<template>
  <section class="tile is-ancestor">
    <div class="tile is-parent">
      <div class="tile is-child box">
        <p class="title">NLP Options</p>

        <section>
          <p class="subtitle strong">Time tagging options</p>
          <b-field label="Input language">
            <b-select placeholder="Input language" v-model="options.lang">
              <option v-for="lang in langs" :value="lang.short" :key="lang.short">{{ lang.long }}</option>
            </b-select>
          </b-field>
          <b-field label="Document Creation Time">
            <b-switch
              v-model="options.read_dct_from_metadata"
            >Use DCT from metadata (Not implemented yet).</b-switch>
          </b-field>
          <b-field v-show="!options.read_dct_from_metadata">
            Select DCT:
            <b-datepicker v-model="dct_field" placeholder="Select DCT." icon="calendar-today"></b-datepicker>
          </b-field>
        </section>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { NlpOptions, formatDCTString } from "../NlpParameters";

@Component
export default class NlpOptionsForm extends Vue {
  @Prop({ required: true }) initialOptions!: NlpOptions;

  options: NlpOptions = this.initialOptions;

  langs = [
    { short: "en", long: "English" },
    { short: "fr", long: "French" },
    { short: "de", long: "German" },
    { short: "it", long: "Italian" },
    { short: "es", long: "Spanish" }
  ];

  // initializes the datepicker field with a date string like "1970-01-01"
  dct_field: Date = new Date(this.options.document_creation_time);

  @Watch("options.lang")
  @Watch("options.read_dct_from_metadata")
  opOptionsChanged() {
    this.signalOptionsChanged();
  }

  @Watch("dct_field")
  onDctFieldChanged(dct_field: Date) {
    this.options.document_creation_time = formatDCTString(dct_field);
    this.signalOptionsChanged();
  }

  signalOptionsChanged() {
    this.$emit("options-updated", this.options);
  }
}
</script>
