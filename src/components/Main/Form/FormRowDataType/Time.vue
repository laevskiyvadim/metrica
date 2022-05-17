<template>
  <input type="time" class="time" v-model="input" :disabled="disabled" />
  <i class="icon-time"></i>
</template>
<script>
export default {
  props: {
    value: { type: String, default: undefined },
    changeElements: { type: Function, default: null },
    disabled: { type: Boolean, default: false },
  },
  watch: {
    input() {
      if (this.changeElements != null) {
        this.changeElements(this.input, true);
      }
    },
  },
  data() {
    return {
      input: "",
    };
  },
  beforeMount() {
    let currentTime = this.value.split(":");
    if (currentTime[0].length == 1) {
      currentTime[0] = "0" + currentTime[0];
    }

    this.input = currentTime.join(":");
  },
};
</script>
