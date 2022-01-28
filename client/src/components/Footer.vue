<template>
    <footer class="p-10 footer bg-base-200 text-base-content footer-center">
        <div class="grid grid-flow-col gap-4">
            <a class="link link-hover">About</a>
            <a
                class="link link-hover"
                href="mailto://bhavjit_chauhan@cs.sfu.ca"
                target="_blank"
            >Contact</a>
            <a
                class="link link-hover"
                href="https://github.com/bhavjitChauhan/khanalytics"
                target="_blank"
            >GitHub</a>
        </div>
        <div>
            <img
                src="../assets/logo.png"
                alt="Khan Academy Khanalytics"
                width="32"
                height="auto"
                class="grayscale"
            />
        </div>
        <div>
            <p>Copyright © 2021 - Bhavjit Chauhan</p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
};
</script>