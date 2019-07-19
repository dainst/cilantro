<template>
    <div class="container">
        <h3 class="is-size-3">Start a new job</h3>
        <div class="tile is-ancestor">
            <div class="tile is-parent">
                <div class="tile is-child box">
                    <p class="title">Journal import</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque
                        tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                </div>
                <div class="tile is-child box">
                    <p class="title">Book import</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque
                        tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                </div>
                <div class="tile is-child box">
                    <p class="title">NLP Processing</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at
                        pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut.
                        Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut
                        quam.</p>
                </div>
                <!-- usw. -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class StartJobSelection extends Vue {
}
</script>
