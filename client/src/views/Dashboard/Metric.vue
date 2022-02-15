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
                v-if="isNaN(value)"
                class="flex space-x-4 animate-pulse"
            >
                <div class="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
            <span
                v-else
                :class="
                    percentDiff < 0 ? 'text-error' : percentDiff > 0 ? 'text-success' : ''
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
import { isDarkModeEnabled } from '@/util/darkMode';

export default {
    name: 'Metric',
    props: {
        title: String,
        tooltip: String,
        data: Array,
        chartColor: String
    },
    data: () => ({
        chartOptions: {
            chart: {
                background: isDarkModeEnabled() ? 'transparent' : '#fff',
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
            theme: {
                mode: isDarkModeEnabled() ? 'dark' : 'light'
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
        }
    }),
    computed: {
        isDarkModeEnabled() {
            return isDarkModeEnabled();
        },
        value() {
            const data = this.data;
            if (!data) return null;
            return data[data.length - 1];
        },
        previousValue() {
            const data = this.data;
            if (!data) return null;
            return data[data.length - 2];
        },
        diff() {
            const data = this.data;
            if (!data) return null;
            return this.value - this.previousValue;
        },
        percentDiff() {
            const data = this.data;
            if (!data) return null;
            return Math.round(
                ((this.value - this.previousValue) / this.previousValue) * 100
            );
        },
        chartSeries() {
            return [
                {
                    data: this.data
                }
            ];
        }
    },
    methods: {        
        handleDarkModeToggle(isDarkModeEnabled) {
            this.chartOptions = {
                ...this.chartOptions,
                chart: {
                    ...this.chartOptions.chart,
                    background: isDarkModeEnabled ? 'transparent' : '#fff'
                },
                theme: {
                    mode: isDarkModeEnabled ? 'dark' : 'light'
                }
            };
        }
    },
    created() {
        this.chartOptions = {
            ...this.chartOptions,
            colors: [this.chartColor]
        };
    },
    mounted() {
        this.emitter.on('dark-mode-toggle', this.handleDarkModeToggle);
    }
};
</script>
