<script setup lang="ts">
import { withBase } from "vitepress"

const lightSrc = withBase("/diagrams/controllers.svg")
const darkSrc = withBase("/diagrams/controllers-dark.svg")
</script>

<template>
	<figure class="sw-diagram">
		<img
			class="sw-diagram__light"
			:src="lightSrc"
			width="800"
			height="284"
			alt="Web, SocketIO, Events, gRPC and Jobs controllers are registered in a Module inside the Sword Application."
		/>
		<img
			class="sw-diagram__dark"
			:src="darkSrc"
			width="800"
			height="284"
			alt="Web, SocketIO, Events, gRPC and Jobs controllers are registered in a Module inside the Sword Application."
		/>
	</figure>
</template>

<style>
.sw-diagram {
	display: flex;
	justify-content: center;
	margin: 0;
	padding: 0;
}

.sw-diagram img {
	display: block;
	width: 100%;
	max-width: 1200px;
	height: auto;
	margin: 0;
}

.sw-diagram img.sw-diagram__dark {
	display: none;
}

.dark .sw-diagram img.sw-diagram__dark {
	display: block;
}

.dark .sw-diagram img.sw-diagram__light {
	display: none;
}
</style>
