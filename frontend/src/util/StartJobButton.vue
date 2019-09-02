<template>
    <b-button @click="onClick"
            icon-left="play"
            class="is-pulled-right"
            type="is-primary"
            rounded>
        Start Job
    </b-button>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class StartJobButton extends Vue {
    
    onClick() {
        this.$emit('click');
    }

}
</script>
