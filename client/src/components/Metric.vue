<template>
    <div
        class="stat"
        id="programs-stat"
    >
        <div class="stat-figure">
            <apexchart
                v-if="chartSeries[0].data"
                type="bar"
                height="35"
                width="100"
                :options="chartOptions"
                :series="chartSeries"
            ></apexchart>
        </div>
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
                :class="
                    percentDiff < 0 ? 'red' : percentDiff > 0 ? 'green' : ''
                "
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
                <span v-if="percentDiff !== 0">{{ Math.abs(percentDiff) }}% ({{ diff > 0 ? '+' : ''
                    }}{{ diff }})</span>
                <span v-else>No change ({{ diff > 0 ? '+' : '' }}{{ diff }})</span>
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
        data: Array,
        chartColor: String
    },
    data: () => ({
        value: null,
        diff: null,
        percentDiff: null,
        chartOptions: {
            chart: {
                id: Math.random().toString().slice(2),
                group: 'statistics',
                animations: {
                    enabled: false
                },
                type: 'bar',
                width: 100,
                height: 35,
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: '80%'
                }
            },
            xaxis: {
                crosshairs: {
                    width: 1
                }
            },
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return '';
                        }
                    }
                },
                marker: {
                    show: false
                }
            }
        },
        chartSeries: [
            {
                data: null
            }
        ]
    }),
    methods: {
        isNumber(value) {
            return typeof value == 'number';
        },
        calculatePercentDiff(a, b) {
            return Math.round(((a - b) / b) * 100);
        },
        prepareData() {
            const lastIndex = this.data.length - 1;
            this.value = this.data[lastIndex];
            this.diff = this.data[lastIndex] - this.data[lastIndex - 1];
            this.percentDiff = this.calculatePercentDiff(
                this.data[lastIndex],
                this.data[lastIndex - 1]
            );
            this.chartSeries[0].data = this.data;
        }
    },
    mounted() {
        this.chartOptions = {
            ...this.chartOptions,
            colors: [this.chartColor]
        };
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
