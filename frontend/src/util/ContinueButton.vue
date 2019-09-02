<template>
    <b-button @click="onClick"
            icon-right="chevron-right"
            class="is-pulled-right"
            type="is-primary"
            rounded>
        Continue
    </b-button>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class ContinueButton extends Vue {
    
    onClick() {
        this.$emit('click');
    }

}
</script>
