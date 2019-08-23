<template>
    <section>
        <b-button @click="newPart">New Part</b-button>
        <b-button>Import CSV</b-button>
        <ul id="part_list">
            <li v-for="(part, index) in parts">
                <BookPartDetailForm v-bind:partData="part.metadata" />
                <b-button @click="deletePart(index)">Delete Part</b-button>
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BookPartDetailForm from './BookPartDetailForm.vue';
import {
    BookPart
} from '../BookImportParameters';

@Component({
    components: {
        BookPartDetailForm
    }
})
export default class BookPartsForm extends Vue {
    @Prop() initialData!: BookPart[]

    parts: BookPart[] = this.initialData;

    deletePart(index: number) {
        this.parts.splice(index, 1);
    }

    newPart() {
        const part = {
            metadata: { title: 'test title' },
            range: [1, 2]
        } as BookPart;
        this.parts.push(part);
    }
}
</script>

<style scoped lang="scss">
    li {
      display: inline-block;
      margin: 0 10px;
    }

    #part_list section {
        border-style: solid;
    }
</style>
