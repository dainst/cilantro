<template>
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">Select the destination folder</p>
        </header>
        <div class="card-content">
            <nav class="breadcrumb">
                <ul>
                    <li
                        v-for="(dir, index) in workingDirectoryArray"
                        :key="index + dir"
                        :class="{ 'is-active': index >= workingDirectoryArray.length - 1}"
                    >
                        <a @click="openBreadcrumbEntry(index)">
                            <b-icon icon="home" v-if="index == 0"></b-icon>
                            <span v-if="index > 0">{{ dir }}</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <div v-if="this.directories.length == 0">Folder is empty ...</div>
            <b-menu>
                <b-menu-list>
                    <b-menu-item
                        v-for="dir of directories"
                        :key="dir"
                        icon="folder"
                        :label="dir"
                        @click="openDirectory(`${workingDirectory}/${dir}`)"
                    ></b-menu-item>
                </b-menu-list>
            </b-menu>
        </div>
        <div class="card-footer">
            <span class="card-footer-item">
                <b-button @click="$emit('close');">Cancel</b-button>
                <b-button
                    @click="$emit('ok', workingDirectory); $emit('close');"
                    type="is-primary"
                >Move here</b-button>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component, Prop, Vue
} from 'vue-property-decorator';
import { getStagingFiles, WorkbenchFile } from './StagingClient';
import { showError } from '../util/Notifier';

@Component
export default class StagingBrowserFolderSelection extends Vue {
    private directories: string[] = [];
    private workingDirectory: string = '';

    get workingDirectoryArray(): string[] {
        return this.workingDirectory.split('/');
    }

    mounted() {
        this.retrieveDirectories(this.workingDirectory);
    }

    openBreadcrumbEntry(index: number) {
        this.openDirectory(this.workingDirectoryArray.slice(0, index + 1).join('/'));
    }

    async openDirectory(path: string) {
        try {
            this.workingDirectory = path;
            await this.retrieveDirectories(this.workingDirectory);
        } catch (e) {
            showError(`Error opening folder '${this.workingDirectory}'`, e);
        }
    }

    async retrieveDirectories(path: string) {
        const files = await getStagingFiles(path);
        this.directories = files.filter(file => file.type === 'directory').map(file => file.name);
    }
}
</script>
