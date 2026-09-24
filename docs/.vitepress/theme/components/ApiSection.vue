<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        title: string;
        level?: 2 | 3;
    }>(),
    { level: 3 },
);

const headingTag = computed(() => `h${props.level}`);
</script>

<template>
    <details class="api-section">
        <summary class="api-section__summary">
            <component :is="headingTag" class="api-section__title">
                {{ title }}
            </component>
            <span class="api-section__chevron" aria-hidden="true"></span>
        </summary>
        <hr class="api-section__divider" />
        <div class="api-section__body">
            <slot />
        </div>
    </details>
</template>
