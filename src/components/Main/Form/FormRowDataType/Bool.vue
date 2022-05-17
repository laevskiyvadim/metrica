<template>
  <div class="switch" @click.stop="switcher = !switcher">
    <div
      class="container"
      :style="{
        'margin-left': !switcher ? `-${width}` : '0px',
      }"
    >
      <span class="primary" :style="{ width: width }">
        {{ values.bitAccords[1] }}
      </span>
      <span class="switch-label">&nbsp;</span>
      <span class="default" :style="{ width: width }">
        {{ values.bitAccords[0] }}
      </span>
      <input type="checkbox" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    values: { type: Object, required: true },
    nativeValue: { type: String, default: undefined },
  },
  data() {
    return {
      switcher: false,
      width: "64px",
    };
  },
  computed: {
    hasFormCondition: function () {
      return this.convertToBool() != this.switcher;
    },
    formCondition: function () {
      return { [this.values.columnNamePseudo]: this.switcher };
    },
  },
  methods: {
    convertToBool: function () {
      if (this.nativeValue == "True") {
        return true;
      } else if (this.nativeValue == "False") {
        return false;
      }
    },
  },
  beforeMount() {
    this.switcher = this.convertToBool();
  },
};
</script>
