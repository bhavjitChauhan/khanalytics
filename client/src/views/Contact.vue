<template>
    <Container>
        <div class="mx-0 md:mx-16 lg:mx-32 form-control md:my-8 lg:my-16">
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
                <label
                    v-if="warning"
                    class="h-0 mb-4 label"
                >
                    <span class="label-text-alt text-warning">Empty message</span>
                </label>
                <button
                    type="submit"
                    form="contact_form"
                    name="submit"
                    class="btn btn-primary"
                    :class="{ loading: sending, 'btn-disabled': sending || sent }"
                    :disabled="sending"
                >
                    {{ sending ? 'Sending...' : sent ? 'Sent!' : 'Send' }}
                </button>
            </form>
        </div>
    </Container>
</template>

<script>
import gtag from 'vue-gtag';

import api from '@/services/api';

import Container from '@/components/Container';

export default {
    name: 'Contact',
    components: {
        Container
    },
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
            await api.postEmail(name, body);

            this.sending = false;
            this.sent = true;

            gtag.event('email_form_complete');
        }
    }
};
</script>