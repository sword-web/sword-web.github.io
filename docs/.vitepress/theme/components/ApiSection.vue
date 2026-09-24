<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
	defineProps<{
		title: string
		level?: 2 | 3
		collapsed?: boolean
	}>(),
	{ level: 3, collapsed: true },
)

const headingTag = computed(() => `h${props.level}`)
</script>

<template>
	<details class="api-section" :open="!collapsed">
		<summary class="api-section__summary">
			<component :is="headingTag" class="api-section__title">
				{{ title }}
			</component>
			<span class="api-section__chevron" aria-hidden="true"></span>
		</summary>
		<div class="api-section__body">
			<slot />
		</div>
	</details>
</template>
