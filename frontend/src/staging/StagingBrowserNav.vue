<template>
    <div class="level">
        <div class="level-left">
            <div class="level-item">
                <nav class="breadcrumb">
                    <ul>
                        <li
                            v-for="(dir, index) in workingDirectoryArray"
                            :key="index + dir"
                            :class="{ 'is-active': index >= workingDirectoryArray.length - 1}"
                        >
                            <a @click="openFolder(index)">
                                <b-icon icon="home" v-if="index == 0"></b-icon>
                                <span v-if="index > 0">{{ dir }}</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="level-item">
                <b-tooltip label="Create folder">
                    <b-button
                        type="is-text"
                        icon-right="folder-plus"
                        @click="$emit('create-folder')"
                    ></b-button>
                </b-tooltip>
                <b-field>
                    <p class="control">
                        <b-tooltip label="Move selected">
                            <b-button
                                type="is-text"
                                icon-right="folder-move"
                                @click="$emit('move-selected')"
                                :disabled="isFileSelected"
                            ></b-button>
                        </b-tooltip>
                    </p>
                    <p class="control">
                        <b-tooltip label="Remove selected">
                            <b-button
                                type="is-text"
                                icon-right="delete"
                                @click="$emit('delete-selected')"
                                :disabled="isFileSelected"
                            ></b-button>
                        </b-tooltip>
                    </p>
                </b-field>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item"></div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component, Prop, Vue
} from 'vue-property-decorator';

@Component
export default class StagingBrowserNav extends Vue {
    @Prop({ default: '' }) workingDirectory!: string;
    @Prop({ default: false }) isFileSelected!: boolean;

    get workingDirectoryArray(): string[] {
        return this.workingDirectory.split('/');
    }

    openFolder(index: number) {
        this.$emit('open-folder', this.workingDirectoryArray.slice(0, index + 1).join('/'));
    }
}

</script>
