<template>
    <div class="min-h-screen hero">
        <div class="text-center hero-content">
            <div class="max-w-md">
                <h1 class="mb-5 text-5xl font-bold">
                    404
                </h1>
                <p class="mb-5">
                    The page you are looking for does not exist. If you believe this is an error, fill out this <router-link
                        to="/contact"
                        class="link"
                    >contact form</router-link>.
                </p>
                <router-link
                    to="/"
                    class="btn btn-primary"
                >Home</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotFound'
};
</script>
