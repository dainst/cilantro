<template>
    <section>
        <div class="tile is-ancestor">
            <div class="tile is-parent is-vertical">
                <b-field tile is-child label="title">
                    <b-input v-model="partData.title"></b-input>
                </b-field>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BookPart, FileParam } from '../BookImportParameters';

@Component
export default class BookPartDetailForm extends Vue {
    @Prop() private partData!: BookPart
}
</script>
