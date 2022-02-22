<template>
    <Container
        :height="height"
        class="relative overflow-auto"
    >
        <table
            v-if="peaks"
            class="table w-full table-compact"
        >
            <thead>
                <tr>
                    <th class="text-right">Metric</th>
                    <th>Max</th>
                    <th><a href="https://en.wikipedia.org/wiki/Mean#Arithmetic_mean_(AM)" target="_blank">Mean</a></th>
                    <th><a href="https://en.wikipedia.org/wiki/Median" target="_blank">Median</a></th>
                    <th><a href="https://en.wikipedia.org/wiki/Standard_deviation" target="_blank"><abbr title="Standard Deviation">S.D.</abbr></a></th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(peak, key) in peaks"
                    :key="key"
                    class="text-right hover"
                >
                    <th class="text-left">{{ key }}</th>
                    <td>
                        {{ peak.max }}
                    </td>
                    <td>
                        {{ (peak.mean).toFixed(2) }}
                    </td>
                    <td>
                        {{ peak.median }}
                    </td>
                    <td>
                        {{ (peak.sd).toFixed(2) }}
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- <InfoButton
            v-if="peaks"
            id="heatmap-table-modal"
            :corner="true"
        >
            <p>
                This table shows statistics for change in the metrics of the current program. Change is measuered hourly. 
            </p>
            <br>
            <p>
                The <b>maximum</b> is the most the metric changed in one hour.
            </p>
            <p>
                The <b>mean</b> is the average change in the metric.
            </p>
            <p>
                The <b>median</b> is 
            </p>
        </InfoButton> -->
        <div v-if="isPredatingProgram" class="flex items-center justify-center w-full h-full">
            <span class="font-bold uppercase text-neutral">No data</span>
        </div>
    </Container>
</template>

<script>
import { mean, median, standardDeviation } from '@/util/statistics';

import Container from '@/components/Container.vue';
import InfoButton from '@/components/InfoButton.vue';

export default {
    name: 'HeatMapTable',
    components: {
        Container,
        InfoButton
    },
    props: {
        height: String
    },
    computed: {
        isPredatingProgram() {
            return this.$parent.isPredatingProgram;
        },
        performance() {
            return this.$parent.performance;
        },
        peaks() {
            const performance = this.performance;
            if (!performance) return null;

            const labels = [
                ['rank', 'Rank'],
                ['votes', 'Votes'],
                ['forks', 'Forks'],
                ['comments', 'Comments'],
                ['commentVotes', 'Upvotes'],
                ['replies', 'Replies']
            ];

            const peaks = {};
            for (const [key, label] of labels) {
                const values = performance.map((element) => element[key]);
                const differences = values.map((value, i, arr) =>
                    Math.abs(value - (i === 0 ? 0 : arr[i - 1]))
                );

                peaks[label] = {
                    max: Math.max(...differences),
                    mean: mean(differences),
                    median: median(differences),
                    sd: standardDeviation(differences)
                };
            }

            return peaks;
        }
    }
};
</script>
