<template>
    <div class="p-5 mx-64 mt-32">
        <div class="p-5 rounded ring-offset-2 ring-1 ring-gray-200">
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
                        @input="event => name = event.target.value"
                    >
                    <label class="label">
                        <span class="label-text">Message</span>
                    </label>
                    <textarea
                        name="body"
                        placeholder="Message"
                        class="w-full h-24 textarea textarea-bordered"
                        :class="{ 'input-warning': warning }"
                        @input="event => body = event.target.value"
                    ></textarea>
                    <label class="h-0 mt-2 label">
                        <span
                            v-if="warning"
                            class="label-text-alt text-warning"
                        >Empty message</span>
                    </label>
                    <button
                        type="submit"
                        form="contact_form"
                        name="submit"
                        class="mt-4 btn btn-primary"
                        :class="{ loading: sending, 'btn-disabled': sending || sent }"
                        :disabled="sending"
                    >
                        {{ sending ? 'Sending...' : sent ? 'Sent!' : 'Send' }}
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
    data: () => ({
        name: null,
        body: null,
        sending: false,
        sent: false
    }),
    computed: {
        warning() {
            return !this.body && typeof this.body == 'string' && !this.sent;
        }
    },
    methods: {
        async submit(event) {
            const name = this.name || 'Anonymous';
            const body = this.body;
            if (!body) return;

            this.sending = true;
            await api.postEmail(name, body)            

            this.sending = false;
            this.sent = true;
        }
    }
};
</script>