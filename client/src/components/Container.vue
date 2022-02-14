<template>
    <div class="p-5 rounded ring-offset-2 ring-1 ring-gray-200" :style="{ width, height }">
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

