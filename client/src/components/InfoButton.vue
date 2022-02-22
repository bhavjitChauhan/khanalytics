<template>
    <label
        :for="id"
        class="btn btn-circle btn-outline modal-button btn-sm lg:btn-xs"
        :class="{ 'float-right': !demo, absolute: corner, 'mt-4': corner, 'ml-0': corner, sticky: hovering, 'm-2': hovering }"
        :style="{ top: (corner ? 0 : 'auto'), right: hovering ? 0 : 'auto' }"
    >
        <font-awesome-icon icon="info" />
    </label>
    <input
        v-if="!demo"
        type="checkbox"
        :id="id"
        class="modal-toggle"
    >
    <div class="modal">
        <div class="modal-box">
            <slot></slot>
            <div class="modal-action">
                <label
                    :for="id"
                    class="btn lg:btn-sm"
                >Close</label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InfoButton',
    props: {
        id: {
            type: String,
            required: true
        },
        corner: {
            type: Boolean,
            default: false
        },
        hovering: {
            type: Boolean,
            default: false
        },
        demo: {
            type: Boolean,
            default: false
        }
    }
};
</script>
