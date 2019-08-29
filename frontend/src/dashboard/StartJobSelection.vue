<template>
    <div class="container">
        <h3 class="is-size-3">Start a new job</h3>
        <div class="tile is-ancestor">
            <div class="tile is-parent">
                <div class="tile is-child box">
                    <p class="title">Journal import</p>
                    <p>Job Type Description</p>
                    <router-link to="ingest-journal" tag="b-button">
                        Start
                    </router-link>
                </div>
                <div class="tile is-child box">
                    <p class="title">Book import</p>
                    <p>Job Type Description</p>
                    <router-link to="ingest-book" tag="b-button">
                        Start
                    </router-link>
                </div>
                <div class="tile is-child box">
                    <p class="title">NLP Processing</p>
                    <p>Job Type Description</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class StartJobSelection extends Vue {
    
}
</script>
