<script setup lang="ts">
import { withBase } from "vitepress"

const lightSrc = withBase("/diagrams/dependency-injection.svg")
const darkSrc = withBase("/diagrams/dependency-injection-dark.svg")
</script>

<template>
	<figure class="sw-diagram">
		<img
			class="sw-diagram__light"
			:src="lightSrc"
			width="720"
			height="176"
			alt="Dependency Container: UserService injects UserRepository, which injects Database. Database is a provider; UserRepository and UserService are components."
		/>
		<img
			class="sw-diagram__dark"
			:src="darkSrc"
			width="720"
			height="176"
			alt="Dependency Container: UserService injects UserRepository, which injects Database. Database is a provider; UserRepository and UserService are components."
		/>
	</figure>
</template>

<style>
.sw-diagram {
	display: flex;
	justify-content: center;
	padding: 1rem 0;
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
