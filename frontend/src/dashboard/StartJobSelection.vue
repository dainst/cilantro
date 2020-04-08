<template>
    <div class="container">
        <h3 class="is-size-3">Start a new job</h3>
        <div class="tile is-ancestor">
            <div class="tile is-parent">
                <div class="tile is-child box">
                    <p class="title">Retrodigitized Journals</p>
                    <p>
                        Import multiple folders that contain scans of journal issues
                        into iDAI.publications / OJS.
                    </p>
                    <router-link to="ingest-journal" tag="b-button" id="start_ingest_journal">Start</router-link>
                </div>
                <div class="tile is-child box">
                    <p class="title">Retrodigitized Books</p>
                    <p>
                        Import multiple folders that contain scans of Book issues
                        into iDAI.publications / OMP.
                    </p>
                    <router-link to="ingest-book" tag="b-button" id="start_ingest_book">Start</router-link>
                </div>
                <div class="tile is-child box">
                    <p class="title">Retrodigitized Archival Material</p>
                    <p>
                        Import multiple folders that contain scans of archival material
                        into iDAI.archives / AtoM.
                    </p>
                    <router-link to="ingest-archival-material" tag="b-button" id="start_ingest_archival_material">Start</router-link>
                </div>
                <div class="tile is-child box">
                    <p class="title">NLP Processing</p>
                    <p>
                        <i>work in progress ...</i>
                    </p>
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
