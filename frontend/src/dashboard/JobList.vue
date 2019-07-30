<template>
    <div v-if="this.$store.getters.isAuthenticated">
        <h3 class="is-size-5">
            Your active jobs
             <a @click="updateJobList"><b-icon icon="refresh" size="is-small">
            </b-icon></a>
        </h3>
        <div v-for="job in jobList" :key="job['job_id']">
            <router-link class="message" :to="{ name: 'job', query: { id: job['job_id'] }}">
                <div class="message-header">
                    <b-icon v-bind="iconAttributesForState(job['state'])"></b-icon>
                    {{job['job_id']}}
                </div>
                <div class="message-body has-text-left">
                    <div>
                        <span class="has-text-weight-semibold">Name</span>
                        {{job['name']}}
                    </div>
                    <div>
                        <span class="has-text-weight-semibold">Created</span>
                        {{job['created']}}
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class JobList extends Vue {
    jobList: object[] = [];

    iconAttributesForState = (state : string) => {
        if (state === 'new') {
            return [{ icon: 'alarm' }];
        } if (state === 'started') {
            return [{ type: 'is-warning' }, { icon: 'cogs' }];
        } if (state === 'success') {
            return [{ type: 'is-success' }, { icon: 'check' }];
        }
        return [{ type: 'is-danger' }, { icon: 'alert' }];
    }

    async updateJobList() {
        try {
            const response = await axios.get(`${this.$store.state.backendURI}job/jobs`)
            this.jobList = response.data;
        } catch (error) {
            console.error('Invalid Server Response:', error.response);
        }
    }

    mounted() {
        if (this.$store.getters.isAuthenticated) {
            this.updateJobList();
        }

        this.$store.watch(
            (state, getters) => getters.isAuthenticated,
            (newValue: boolean, oldValue: boolean) => {
                if (newValue) {
                    this.updateJobList();
                }
            }
        );
    }
}
</script>
