<script setup lang="ts">
import { computed } from "vue"
import { useData, useRoute, useRouter } from "vitepress"

type Version = {
	value: string
	label: string
	disabled?: boolean
}

const versions: Version[] = [
	{ value: "0.6", label: "0.6" },
	{ value: "0.7", label: "0.7 (next)", disabled: true },
]

const route = useRoute()
const router = useRouter()
const { lang } = useData()

const current = computed(() => {
	const segments = route.path.split("/").filter(Boolean)
	return segments[1] ?? "0.6"
})

function onChange(event: Event) {
	const value = (event.target as HTMLSelectElement).value
	router.go(`/${lang.value}/${value}/`)
}
</script>

<template>
	<select
		class="version-select"
		:value="current"
		aria-label="Documentation version"
		@change="onChange"
	>
		<option
			v-for="version in versions"
			:key="version.value"
			:value="version.value"
			:disabled="version.disabled"
		>
			{{ version.label }}
		</option>
	</select>
</template>

<style scoped>
.version-select {
	margin-left: 12px;
	padding: 4px 8px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	background: var(--vp-c-bg);
	color: var(--vp-c-text-1);
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
}

.version-select:focus {
	outline: 2px solid var(--vp-c-brand-1);
	outline-offset: 2px;
}
</style>
