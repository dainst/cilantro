<template>
    <section>
        <b-table :data="jobList" detailed detail-key="job_id" default-sort="created">
            <template slot-scope="props">
                <b-table-column field="job_id" label="ID" sortable>
                    {{ props.row.job_id }}
                </b-table-column>
                <b-table-column field="name" label="Name" sortable>
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="job_type" label="Type" sortable>
                    {{ props.row.job_type }}
                </b-table-column>
                <b-table-column field="state" label="Status" sortable>
                    {{ props.row.state }}
                </b-table-column>
                <b-table-column field="created" label="Created" sortable>
                    {{ props.row.created }}
                </b-table-column>
                <b-table-column field="updated" label="Updated" sortable>
                    {{ props.row.updated }}
                </b-table-column>
                <b-table-column>
                    <b-button @click="gotoSingleView(props.row.job_id)">Single View</b-button>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div>
                    <b-field label="Job Parameters">
                        {{ props.row.params }}
                    </b-field>
                </div>
                <div v-if="props.row.errors.length > 0">
                    <b-field label="Error Details">
                        {{ props.row.errors }}
                    </b-field>
                </div>
            </template>
        </b-table>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Job } from './Job';

@Component
export default class JobsView extends Vue {
    backendUri = this.$store.state.AuthenticationStore.backendUri;

    jobList: Job[] = [];

    mounted() {
        this.updateJobList();
    }

    gotoSingleView(id: string) {
        this.$router.push({
            path: 'job',
            query: { id }
        });
    }

    async updateJobList() {
        try {
            const response = await axios.get(`${this.backendUri}/job/jobs`);
            this.jobList = response.data;
        } catch (error) {
            console.error('Invalid Server Response:', error.response);
        }
    }
}
</script>

<style lang="scss">
</style>
