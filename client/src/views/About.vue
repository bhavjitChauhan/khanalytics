<template>
    <div class="p-5 mx-64 mt-32">
        <div class="p-5 rounded shadow-lg">
            <img
                alt="Khanalytics Logo"
                src="../assets/logo.png"
                class="h-32 mx-auto"
            />
            <div class="mt-8"></div>
            <h1 class="text-3xl font-bold text-center">
                Khanalytics
            </h1>
            <h2 class="mb-16 text-lg text-center text-gray-500">
                (Khan + Analytics)
            </h2>
            <div class="px-32 py-8">
                <h3 class="text-lg font-bold">About</h3>
                <p>
                    Explore, analyze, and visualize the performance of your programs on <a
                        href="https://www.khanacademy.org/browse"
                        target="_blank"
                        class="link-primary"
                    >Khan Academy</a>.
                </p>
                <br>
                <p>
                    Khanalytics is a web application that allows you to better understand the activity of the Hotlist and the performance of your programs. It does this by providing various visual tools that allow you to compare and see what exactly makes a program go from a good program to a great program.
                </p>
                <div class="mt-12"></div>
                <h3 class="text-lg font-bold">FAQ</h3>
                <div class="mt-4"></div>
                <div class="grid grid-flow-col gap-4">
                    <div
                        tabindex="0"
                        class="border collapse w-96 rounded-box border-base-300 collapse-arrow"
                        v-for="question in entries"
                        v-bind:key="question"
                    >
                        <div>
                            <div class="font-medium text-l collapse-title">
                                {{ question[0] }}
                            </div>
                            <div class="collapse-content">
                                <p v-html="question[1]"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data: () => ({
        entries: [
            [
                `Where does Khanalytics get it's data?`,
                `Khanalytics uses Khan Academy's API to fetch the data of the top 100 program on the Hotlist.
                <br><br>
                Although the Hotlist updates every 10 minutes, Khanalytics only updates hourly. This is done to reduce the amount of data involved in the process.
                <br><br>
                This information is then stored and used to generate the visualizations.`
            ],
            [
                `Where does Khanalytics store it's data?`,
                `Khanalytics uses a <a href="https://www.mongodb.com/" target="_blank" class="link">MongoDB</a> database behind-the-scenes to store and perform analysis on the data.`
            ],
            [
                `I have a feature request or bug report`,
                `To report a bug or request a feature, please visit the contact page linked at the bottom of the page.`
            ]
        ]
    })
};
</script>
