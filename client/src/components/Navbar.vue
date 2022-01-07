<template>
    <div
        class="m-2 shadow-lg navbar bg-primary text-neutral-content rounded-box"
    >
        <div class="px-2 mx-2 navbar-start">
            <span class="text-lg font-bold"> Trends </span>
        </div>
        <div class="px-2 mx-2 navbar-end">
            <div data-tip="Next Refresh" class="tooltip tooltip-bottom">
                <font-awesome-icon icon="history" />
            </div>
            <span class="ml-2 text-lg font-bold countdown">
                <span id="minutes" style="--value: 0"></span>m
                <span id="seconds" style="--value: 0"></span>s
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Navbar',
    mounted() {
        const countdownMinutes = document.querySelector('#minutes');
        const countdownSeconds = document.querySelector('#seconds');
        const updateCountdownMinutes = () => {
            const minutes = 60 - new Date().getMinutes();
            countdownMinutes.style.setProperty('--value', minutes);
        };
        const updateCountdownSeconds = () => {
            const seconds = (60 - new Date().getSeconds()) % 60;
            if (seconds == 0) updateCountdownMinutes();
            countdownSeconds.style.setProperty('--value', seconds);
        };
        updateCountdownMinutes();
        updateCountdownSeconds();
        setInterval(updateCountdownSeconds, 1000);
    }
};
</script>
