<template>
    <div
        class="stat"
        id="programs-stat"
    >
        <div class="stat-title">{{ title }}</div>
        <div class="stat-value">
            <div
                v-if="!value"
                class="flex space-x-4 animate-pulse"
            >
                <div class="w-1/3 h-8 bg-gray-300 rounded"></div>
            </div>
            <span v-if="value">{{ value }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Metric',
    props: {
        title: String,
        value: Number
    }
};
</script>
