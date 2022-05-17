<template>
  <input type="date" class="date" v-model="input" :disabled="disabled" />
  <i class="icon-calendar-empty"></i>
</template>
<script>
export default {
  props: {
    value: { type: String, default: undefined },
    column: { type: Object, default: null },
    changeElements: { type: Function, default: null },
    disabled: { type: Boolean, default: false },
  },

  data() {
    return {
      input: "",
    };
  },
  watch: {
    input() {
      const { dateToServer, input, changeElements } = this;

      if (changeElements != null) {
        changeElements(dateToServer(input));
      }
    },
    value() {
      this.input = this.dateToView(this.value);
    },
  },
  beforeMount() {
    this.input = this.dateToView(this.value);
  },
  computed: {
    formCondition: function () {
      const { completeLink } = this.column;
      const update = { [completeLink]: this.dateToServer(this.input) };
      return update;
    },
    hasFormCondition: function () {
      return this.value != this.dateToServer(this.input);
    },
  },

  methods: {
    dateToServer: function (input) {
      if (input) {
        const date = input.split("-");
        const year = date[0];
        const month = date[1];
        const day = date[2];
        return `${day}.${month}.${year}`;
      }
      return "";
    },
    dateToView: function () {
      if (this.value) {
        const date = this.value.split(".");
        const year = date[2];
        const month = date[1];
        const day = date[0];
        return `${year}-${month}-${day}`;
      }
      return "";
    },
  },
};
</script>
