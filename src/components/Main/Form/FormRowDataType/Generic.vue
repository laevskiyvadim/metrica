<template>
  <div class="text">
    <input type="text" v-model="input" />
  </div>
</template>
<script>
export default {
  props: {
    preselectedValue: { type: String, default: null },
    nativeValue: { type: String, default: null },
    relatedHeader: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
    column: { type: Object, default: null },
  },
  data() {
    return { input: null };
  },
  created() {
    this.input = this.preselectedValue;
  },
  watch: {
    preselectedValue() {
      this.input = this.preselectedValue;
    },
  },
  computed: {
    formCondition: function () {
      const { completeLink } = this.column;
      let update = {
        [completeLink]: this.input,
      };
      return update;
    },
    hasFormCondition: function () {
      return this.input != this.nativeValue;
    },
    condition: function () {
      const { completeLink } = this.column;
      let update = {
        [completeLink]: this.input,
      };
      return update;
    },
    hasCondition: function () {
      return this.input != this.nativeValue;
    },
  },
};
</script>
