<template>
  <div
    class="ui-dropdown"
    @focusout="closeDropDown($event)"
    tabindex="0"
    ref="dropdown"
  >
    <div class="head" @click="dialog = !dialog">
      <slot name="icon"></slot>
    </div>
    <div :class="{ dialog: true, 'is-visible': dialog }">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    closeDropDown($event) {
      if (
        !this.$refs["dropdown"].contains($event.target) ||
        !$event.relatedTarget ||
        !this.$refs["dropdown"].contains($event.relatedTarget)
      ) {
        this.dialog = false;
      }
    },
  },
};
</script>
