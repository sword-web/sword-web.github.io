<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>

<template>
    <details class="api-section">
        <summary class="api-section__summary">
            <span class="api-section__chevron" aria-hidden="true"></span>
            <span class="api-section__title">{{ title }}</span>
        </summary>
        <div class="api-section__body">
            <slot />
        </div>
    </details>
</template>
