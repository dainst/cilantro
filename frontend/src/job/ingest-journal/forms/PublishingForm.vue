<template>
    <section>
        <b-collapse :open="false" aria-id="publishing" class="card">
            <button slot="trigger" aria-controls="contentIdForA11y1">
                Automatisches Veröffentlichen nach dem Import
            </button>
            <div class="notification">
                <div class="content">
                    <p>
                    Hier entsteht das Publishing Formular...
                    </p>
                </div>
            </div>

        </b-collapse>

    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class PublishingForm extends Vue {
    @Prop() private initialData!: Object
}
</script>
