<template>
    <div v-if="isAuthentificated">
        <h3 class="is-size-5">Your active jobs</h3>
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
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component
export default class JobList extends Vue {
    jobList: object[] = [];

    get isAuthentificated() {
        if (this.$store.state.authentification.authentificated) {
            this.updateJobList();
        }
        return this.$store.state.authentification.authentificated;
    }
    iconAttributesForState(state: string) {
        if (state == "new") {
            return [{ icon: "alarm" }];
        } else if (state == "started") {
            return [{ type: "is-warning" }, { icon: "cogs" }];
        } else if (state == "success") {
            return [{ type: "is-success" }, { icon: "check" }];
        } else {
            return [{ type: "is-danger" }, { icon: "alert" }];
        }
    }

    updateJobList() {
        axios
            .get(this.$store.state.backendURI + "job/jobs", {
                auth: {
                    username: this.$store.state.authentification.credentials
                        .name,
                    password: this.$store.state.authentification.credentials
                        .password
                }
            })
            .then(response => {
                this.jobList = response.data;
            })
            .catch(error => {
                console.error("Invalid Server Response:", error.response);
            })
            .then();
    }
}
</script>
