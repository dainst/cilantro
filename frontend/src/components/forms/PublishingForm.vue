<template>
    <section>
        <b-collapse :open="false" aria-id="publishing">
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
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PublishingForm extends Vue { }
</script>
