<template>
    <nav class="level">
        <div class="level-left"></div>
        <div class="level-right">
            <div class="level-item">
                <b-button
                    @click="onClick"
                    icon-left="play"
                    class="is-pulled-right"
                    type="is-danger"
                    rounded
                >Start</b-button>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class StartJobButton extends Vue {
    @Prop({ default: false }) disabled!: boolean;

    onClick() {
        this.$emit('click');
    }
}
</script>
