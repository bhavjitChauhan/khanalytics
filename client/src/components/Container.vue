<template>
    <div
        class="p-5 rounded ring-0 md:ring-1 ring-base-300"
        :style="{ width, height }"
    >
        <slot>
            <div class="flex w-full h-full space-x-4 bg-gray-300 animate-pulse">
            </div>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'Container',
    props: {
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        }
    }
};
</script>

