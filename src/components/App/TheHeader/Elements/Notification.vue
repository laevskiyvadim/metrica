<template>
  <li
    class="notification"
    :class="{ open: dropdown }"
    @focusout="closeDropDown($event)"
    ref="drop"
    tabindex="0"
  >
    <a @click="if (count) dropdown = !dropdown;">
      <i :class="icon"></i>
      <span class="count" v-show="count"> {{ count }} </span>
    </a>
    <ul class="d-menu">
      <li>
        <div>
          <div class="btn btn-info" v-show="count > 0">
            Удалить все
            <i class="icon-remove"></i>
          </div>
        </div>

        <ul class="notifications">
          <div class="btn btn-default" v-show="count > 0">Показать еще...</div>
        </ul>
      </li>
    </ul>
  </li>
</template>
<script>
export default {
  props: { icon: { type: String, required: true } },
  data() {
    return { dropdown: false, count: 1 };
  },

  created() {},

  methods: {
    closeDropDown($event) {
      if (
        !this.$refs["drop"].contains($event.target) ||
        !$event.relatedTarget ||
        !$event.relatedTarget.contains(this.$refs["drop"])
      ) {
        this.dropdown = false;
      }
    },
  },
};
</script>
