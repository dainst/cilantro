<template>
    <section>
        <div class="navbar">
            <div class="navbar-item">
                <b-button @click="showAll">
                    Show all
                </b-button>
            </div>
            <div  v-if="users.length !== 0" class="navbar-item">
                <b-dropdown :triggers="['hover']"
                    aria-role="list" multiple
                    v-model="selectedUsers">
                    <template #trigger>
                        <b-button
                            label="Select users"
                            icon-right="menu-down" />
                    </template>
                    <b-dropdown-item v-for="user in users"
                        :key="user" aria-role="listitem"
                        :value="user">{{user}}
                    </b-dropdown-item>
                </b-dropdown>
            </div>
            <div class="navbar-item">
                <b-switch v-model="showSuccess">
                    Show successful
                </b-switch>
                <b-switch v-model="showFailure">
                    Show failure
                </b-switch>
                <b-switch v-model="showInProgress">
                    Show in progress
                </b-switch>
            </div>
        </div>
        <div>
            <JobListEntry
                :jobIDs="[]"
                :activeStates="activeStates"
                :selectedUsers="selectedUsers">
            </JobListEntry>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { sendRequest } from '@/util/HTTPClient';
import { backendUri } from '@/config';
import JobListEntry from '@/job/JobListEntry.vue';

@Component({
    components: { JobListEntry }
})
export default class JobList extends Vue {
    showSuccess: boolean = true;
    showFailure: boolean = true;
    showInProgress: boolean = true;
    users: string[] = []
    selectedUsers: string[] = []

    mounted() {
        this.loadUsers();
    }

    async loadUsers() {
        try {
            const response = await sendRequest('get', `${backendUri}/user/`, {}, {}, false);
            this.users = response.users;
        } catch (e) {
            this.users = [];
        }
    }

    showAll() {
        this.showSuccess = true;
        this.showFailure = true;
        this.showInProgress = true;
    }

    get activeStates() {
        const states = [];
        if (this.showSuccess) {
            states.push('success');
        }
        if (this.showFailure) {
            states.push('failure');
        }
        if (this.showInProgress) {
            states.push('new');
            states.push('started');
        }
        return states;
    }
}

</script>
