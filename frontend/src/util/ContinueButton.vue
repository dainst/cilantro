<template>
    <nav class="level">
        <div class="level-left"></div>
        <div class="level-right">
            <div class="level-item">
                <b-button
                    :disabled="disabled"
                    @click="onClick"
                    icon-right="chevron-right"
                    class="is-pulled-right"
                    type="is-primary"
                    rounded
                >Continue</b-button>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class ContinueButton extends Vue {
    @Prop({ default: false }) disabled!: boolean;

    onClick() {
        this.$emit('click');
    }
}
</script>
