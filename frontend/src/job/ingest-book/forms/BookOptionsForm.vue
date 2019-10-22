<template>
    <section class="tile is-ancestor">
        <div class="tile is-parent">
            <div class="tile is-child box">
                <JobOptionsForm :options="options"/>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { BookImportOptions, initOptions } from '../BookImportParameters';
import JobOptionsForm from '../../JobOptionsForm.vue';

@Component({
    components: {
        JobOptionsForm
    }
})
export default class BookOptionsForm extends Vue {
    options = initOptions();

    @Watch('options', { deep: true })
    onOptionsChanged(options: BookImportOptions) {
        this.$emit('options-updated', options);
    }
}

</script>
