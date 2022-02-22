<template>
    <footer class="p-10 footer bg-base-200 text-base-content footer-center">
        <div class="grid gap-4 md:grid-flow-col">
            <router-link
                class="link link-hover lg:hidden"
                to="/"
            >Home</router-link>
            <router-link
                class="link link-hover lg:hidden"
                to="/dashboard"
            >Dashboard</router-link>
            <router-link
                class="link link-hover lg:hidden"
                to="/about"
            >About</router-link>
            <router-link
                class="link link-hover"
                to="/contact"
            >Contact</router-link>
            <a
                class="link link-hover"
                href="https://www.khanacademy.org/profile/bhavjitChauhan/projects"
                target="_blank"
            >Khan Academy</a>
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
            <p>Copyright © 2022 - <a href="https://github.com/bhavjitChauhan">Bhavjit Chauhan</a></p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
};
</script>