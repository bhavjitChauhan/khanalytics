<template>
    <div class="min-h-screen rounded hero">
        <div class="text-center hero-content">
            <div class="max-w-md">
                <img
                    alt="Khanalytics Logo"
                    src="../assets/logo.png"
                    class="h-24 mx-auto md:h-32"
                />
                <div class="mt-16"></div>
                <div
                    data-tip="Khan + Analytics"
                    class="tooltip"
                >
                    <h1 class="mb-5 text-5xl font-bold">
                        Khanalytics
                    </h1>
                </div>
                <p class="mb-5">
                    Explore, analyze, and visualize the performance of your programs on <a
                        href="https://www.khanacademy.org/browse"
                        target="_blank"
                        class="link-primary"
                    >Khan Academy</a>.
                </p>
                <router-link
                    to="/dashboard"
                    role="button"
                    class="transition-all btn btn-primary hover:scale-110"
                >
                    Get Started
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home'
};
</script>
