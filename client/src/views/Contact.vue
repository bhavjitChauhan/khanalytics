<template>
    <div class="p-5 mx-64 mt-32">
        <div class="p-5 rounded shadow-lg">
            <div class="py-8 mx-32 form-control">
                <h3 class="text-lg font-bold">Contact</h3>
                <form
                    id="contact_form"
                    @submit.prevent="submit"
                >
                    <label class="label">
                        <span class="label-text">Username</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Anonymous"
                        class="input input-bordered"
                    >
                    <label class="label">
                        <span class="label-text">Message</span>
                    </label>
                    <textarea
                        name="body"
                        placeholder="Message"
                        class="w-full h-24 textarea textarea-bordered"
                    ></textarea>
                    <!-- <input
                        type="submit"
                        name="submit"
                        value="Send"
                        class="mt-4 btn btn-primary"
                    > -->
                    <button
                        type="submit"
                        form="contact_form"
                        name="submit"
                        value="Submit"
                        class="mt-4 btn btn-primary"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/services/api';

export default {
    name: 'Contact',
    methods: {
        async submit(event) {
            const name = event.target.elements.name.value || 'Anonymous';
            const body = event.target.elements.body.value;
            if (!body) return;

            event.target.elements.submit.disabled = true;
            event.target.elements.submit.value = 'Sending...';
            event.target.elements.submit.textContent = 'Sending...';
            event.target.elements.submit.classList.add('btn-disabled', 'loading');

            await api.postEmail(name, body);
            
            event.target.elements.submit.disabled = false;
            event.target.elements.submit.value = 'Sent!';
            event.target.elements.submit.textContent = 'Sent!';
            event.target.elements.submit.classList.remove('loading');

        }
    }
};
</script>