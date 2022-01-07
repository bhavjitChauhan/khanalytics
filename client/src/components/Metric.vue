<template>
    <div
        class="stat"
        id="programs-stat"
    >
        <div class="stat-title">
            {{ title }}
            <span
                :data-tip="tooltip"
                class="tooltip tooltip-right"
            >
                <font-awesome-icon icon="question-circle" />
            </span>
        </div>
        <div class="stat-value">
            <div
                v-if="!value"
                class="flex space-x-4 animate-pulse"
            >
                <div class="w-1/3 h-8 bg-gray-300 rounded"></div>
            </div>
            <span v-if="value">{{ value }}</span>
        </div>
        <div class="stat-desc">
            <div
                v-if="isNaN(diff)"
                class="flex space-x-4 animate-pulse"
            >
                <div class="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
            <span v-if="!isNaN(diff)">
                <span v-if="diff !== 0">{{ diff > 0 ? 'Up' : 'Down' }} {{ Math.abs(diff) }}% since last hour</span>
                <span v-else>No change since last hour</span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Metric',
    props: {
        title: String,
        tooltip: String,
        value: Number,
        diff: Number
    }
};
</script>
