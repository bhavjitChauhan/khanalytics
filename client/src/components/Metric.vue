<template>
    <div
        class="stat"
        id="programs-stat"
    >
        <div class="stat-title">
            {{ title }}
            <span
                v-if="tooltip"
                :data-tip="tooltip"
                class="tooltip tooltip-right"
            >
                <font-awesome-icon :icon="['far', 'question-circle']" />
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
                v-if="!isNumber(value)"
                class="flex space-x-4 animate-pulse"
            >
                <div class="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
            <span
                v-else
                :class="percentDiff < 0 ? 'red' : percentDiff > 0 ? 'green' : ''"
            >
                <font-awesome-icon
                    v-if="percentDiff >= 10"
                    icon="angle-double-up"
                />
                <font-awesome-icon
                    v-else-if="percentDiff > 0"
                    icon="angle-up"
                />
                <font-awesome-icon
                    v-else-if="percentDiff == 0"
                    icon="equals"
                />
                <font-awesome-icon
                    v-else-if="percentDiff <= -10"
                    icon="angle-double-down"
                />
                <font-awesome-icon
                    v-else-if="percentDiff < 0"
                    icon="angle-down"
                />
                &hairsp;
                <span v-if="percentDiff !== 0">{{ Math.abs(percentDiff) }}% ({{ (diff > 0 ? '+' : '') }}{{ diff }})</span>
                <span v-else>No change ({{ (diff > 0 ? '+' : '') }}{{ diff }})</span>
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
        data: Array
    },
    data: () => ({
        value: null,
        diff: null,
        percentDiff: null
    }),
    methods: {
        isNumber(value) {
            return typeof value == 'number';
        },
        calculatePercentDiff(a, b) {
            return Math.round(((a - b) / b) * 100);
        },
        prepareData() {
            this.value = this.data[1];
            this.diff = this.data[1] - this.data[0];
            this.percentDiff = this.calculatePercentDiff(
                this.data[1],
                this.data[0]
            );
        }
    },
    watch: {
        data: {
            handler() {
                this.prepareData();
            }
        }
    }
};
</script>

<style scoped>
.red {
    color: red;
}
.green {
    color: green;
}
</style>
