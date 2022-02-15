<template>
    <label
        :for="id"
        class="float-right btn btn-circle btn-outline modal-button btn-sm lg:btn-xs"
        :class="{ absolute: corner, 'mt-4': corner, 'ml-0': corner }"
        :style="{ top: (corner ? 0 : 'auto') }"
    >
        <font-awesome-icon icon="info" />
    </label>
    <input
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
        id: String,
        corner: Boolean
    }
};
</script>
