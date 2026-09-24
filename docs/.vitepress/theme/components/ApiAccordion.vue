<script setup lang="ts">
defineProps<{
    signature: string;
}>();
</script>

<template>
    <details class="api-accordion">
        <summary class="api-accordion__summary">
            <code class="api-accordion__signature">{{ signature }}</code>
        </summary>
        <div class="api-accordion__body">
            <slot />
        </div>
    </details>
</template>
