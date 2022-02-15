<template>
    <Container>
        <img
            alt="Khanalytics Logo"
            src="../assets/logo.png"
            class="h-24 mx-auto my-8 md:h-32"
        />
        <h1 class="text-3xl font-bold text-center">
            Khanalytics
        </h1>
        <h2 class="mb-16 text-lg text-center text-gray-500">
            (Khan + Analytics)
        </h2>
        <div class="px-0 py-8 md:px-16 lg:mx-32">
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
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div
                    tabindex="0"
                    class="border collapse rounded-box border-base-300 collapse-arrow"
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
    </Container>
</template>

<script>
import Container from '@/components/Container.vue';

export default {
    name: 'Home',
    components: {
        Container
    },
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
                `What do the different metrics mean?`,
                `<b>Rank</b> is the position of the program on the <a href="https://www.khanacademy.org/browse" target="_blank" class="link">Hotlist</a>.<br>
                <b>Votes</b> is the number of votes a program has received.<br>
                <b>Forks</b> is the number of spin-offs created from a program.<br>
                <b>Comments</b> is the number of messages in the Tips and Thanks section of a program.<br>
                <b>Upvotes</b> or <b>comment votes</b> is the total number of votes <i>all</i> comments have received under one program.<br>
                <b>Replies</b> is the total number of replies <i>all</i> comments have received under one program.`
            ],
            [
                `It looks like some data is missing`,                
                `This is possible. If there is no outage logged in the <a href="https://github.com/bhavjitChauhan/khanalytics/wiki/Updates" target="_blank" class="link">Updates</a> page in the wiki, fill out the contact form linked at the bottom of the page.`
            ],
            [
                `Is there any way to go further back?`,
                `Khanalytics started collecting data on August 18th, 2021. If you need access to legacy data, see the <a href="https://github.com/bhavjitChauhan/khanalytics/wiki/Legacy-Data" target="_blank" class="link">Legacy Data</a> page in the wiki.`
            ],
            [
                `How was this project made?`,
                `The Khanalytics source code is available in the <a href="https://github.com/bhavjitChauhan/khanalytics" target="_blank" class="link">GitHub repository</a>.`
            ],
            [
                `I have more questions or a suggestion`,
                `To report a bug or request a feature, fill out the contact form linked at the bottom of the page.`
            ]
        ]
    })
};
</script>
